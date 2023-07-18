<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use ArrayHelpers\Arr;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\OneSignalService;
use App\Models\OneSignal;
use App\Repositories\OneSignalRepository;
use App\Models\UserNotificationSetting;
use App\Repositories\UserNotificationSettingRepository;
use App\Models\PropertyEmail;
use App\Models\PropertyImage;
use App\Models\PropertyPhone;
use App\Repositories\PropertyEmailRepository;
use App\Repositories\PropertyImageRepository;
use App\Repositories\PropertyPhoneRepository;
use App\Services\PropertyEmailService;
use App\Services\PropertyImageService;
use App\Services\PropertyPhoneService;

class DataImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userId;
    protected $teamId;
    protected $csvPath;
    protected $folderId;
    protected $propertyService;
    protected $keys;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($userId, $teamId, $csvPath, $folderId, $propertyService, $keys)
    {
        $this->userId = $userId;
        $this->teamId = $teamId;
        $this->csvPath = $csvPath;
        $this->folderId = $folderId;
        $this->propertyService = $propertyService;
        $this->keys = $keys;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $csv = new \ParseCsv\Csv();
        // $csv->limit = 20000;
        $csv->load_data($this->csvPath);
        $teamId = $this->teamId;
        $userId = $this->userId;

        $user = new User;
        $userRepository = new UserRepository($user);
        $oneSignal = new OneSignal;
        $oneSignalRepository = new OneSignalRepository($oneSignal);
        $userNotificationSetting = new UserNotificationSetting;
        $userNotificationSettingRepository = new UserNotificationSettingRepository($userNotificationSetting);
        $oneSignalService = new OneSignalService($userRepository, $oneSignalRepository, $userNotificationSettingRepository);

        $propertyImage = new PropertyImage;
        $propertyImageRepository = new PropertyImageRepository($propertyImage);
        $propertyImageService = new PropertyImageService($propertyImageRepository);

        $propertyPhone = new PropertyPhone;
        $propertyPhoneRepository = new PropertyPhoneRepository($propertyPhone);
        $propertyPhoneService = new PropertyPhoneService($propertyPhoneRepository);

        $propertyEmail = new PropertyEmail;
        $propertyEmailRepository = new PropertyEmailRepository($propertyEmail);
        $propertyEmailService = new PropertyEmailService($propertyEmailRepository);

        $search = [];
        $index = 0;
        $count = 0; // success count
        $failureCount = 0; // failure count
        $existingCount = 0; // existing count
        $propertyCount = $csv->getTotalDataRowCount();
        $pageSize = 500;
        if ($this->keys) {
            $keys = $this->keys;
            $offset = 0;
            do {
                $csv = new \ParseCsv\Csv();
                $csv->offset = $offset * $pageSize;
                $csv->limit = $pageSize;
                $csv->parse($this->csvPath);
                $properties = $csv->data;

                $createdProperties = [];
                $emails = [];
                $phoneNumberRequest = [];

                $index = 0;
                $search = [];
                foreach ($properties as $property) {
                    $street = null;
                    $city = null;
                    $state = null;
                    $zip = null;
                    if (
                        array_key_exists($keys['address'], $property)
                        && array_key_exists($keys['city'], $property)
                        && array_key_exists($keys['state'], $property)
                        && array_key_exists($keys['zip'], $property)
                    )
                    {
                        $street = $property[$keys['address']];
                        $city = $property[$keys['city']];
                        $state = $property[$keys['state']];
                        $zip = $property[$keys['zip']];
                    }

                    if ($street && $city && $state && $zip) {
                        $search []= array(
                            'requestId'    => $index + 1,
                            'street'    => $street,
                            'city'      => $city,
                            'state'     => $state,
                            'zip'       => $zip
                        );
                    }
                    // emails
                    $emailsToAdd = [];
                    if (array_key_exists($keys['email1'], $property)) {
                        if ($property[$keys['email1']]) {
                            $emailsToAdd []= $property[$keys['email1']];
                        }
                    }
                    if (array_key_exists($keys['email2'], $property)) {
                        if ($property[$keys['email2']]) {
                            $emailsToAdd []= $property[$keys['email2']];
                        }
                    }
                    if (count($emailsToAdd)) {
                        $emails []= array(
                            'request_id'   => $index + 1,
                            'emails'       => $emailsToAdd
                        );
                    }
                    // End of emails
                    // phone numbers
                    if (array_key_exists($keys['phone1'], $property)) {
                        $phoneNumberRequest []= $property[$keys['phone1']];
                    }
                    if (array_key_exists($keys['phone2'], $property)) {
                        $phoneNumberRequest []= $property[$keys['phone2']];
                    }
                    if (array_key_exists($keys['phone3'], $property)) {
                        $phoneNumberRequest []= $property[$keys['phone3']];
                    }
                    // End of phone numbers

                    $index++;
                }

                $request = array(
                    'requests' => $search
                );
                $addresses = $this->propertyService->normalizeAddressBulk($request);

                if ($addresses) {
                    usort($addresses, array($this, 'normalizedAddressSort'));
                    $search = [];
                    $request = [];
                    $searchIndex = 0;
                    foreach ($addresses as $address) {
                        $search []= array(
                            'requestId'     => $searchIndex + 1,
                            'address'       => array(
                                'street'    => Arr::get($address, 'street', null),
                                'city'      => Arr::get($address, 'city', null),
                                'state'     => Arr::get($address, 'state', null),
                                'zip'       => Arr::get($address, 'zip', null),
                            )
                        );
                        $searchIndex++;
                    }
                    $request = array(
                        'requests' => $search,
                        'options'  => array(
                            'take'          => 500,
                            'hideRequests'  => false
                        )
                    );
                    $result = $this->propertyService->propertySearchByAddressBulk($request);
                    if ($result !== 404) {
                        usort($result, array($this, 'searchedAddressSort'));
                        foreach ($result as $item) {
                            $item['folder_id'] = $this->folderId;
                            $item['status'] = 'New';
                            $item['user_id'] = $userId;
                            $item['team_id'] = $teamId;
                            if ($item['address_hash']) {
                                $existingProperties = $this->propertyService->findWhereCount(
                                    array(
                                        'team_id'       => $teamId,
                                        'address_hash'  => $item['address_hash']
                                    )
                                );
                                $existingCount += $existingProperties;
                                if ($existingProperties === 0) {
                                    $createResult = $this->propertyService->create($item);
                                    $lat = $createResult['location_latitude'];
                                    $lon = $createResult['location_longitude'];

                                    $propertyImageService->createStreetViewImage($createResult['id'], $lat, $lon);
                                    if ($createResult) {
                                        $count ++;
                                        $propertyId = $createResult['id'];
                                        $createResult['request_id'] = $item['request_id'];
                                        $createdProperties []= $createResult;
                                        // add emails
                                        $requestId = $item['request_id'];

                                        foreach ($emails as $email) {
                                            if ($email['request_id'] === $requestId) {
                                                foreach ($email['emails'] as $emailToAdd) {
                                                    if ($emailToAdd) {
                                                        $propertyEmailService->create(
                                                            array(
                                                                'email'                 => $emailToAdd,
                                                                'property_id'           => $propertyId,
                                                                'is_manually_updated'   => 0,
                                                                'type'                  => '',
                                                            )
                                                        );
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // Add Phone Numbers to property
                        if (count($createdProperties)) {
                            if (count($phoneNumberRequest)) {
                                $numbers = $this->propertyService->getPhoneNumbers(
                                    array(
                                        'requests'  => $phoneNumberRequest
                                    )
                                );

                                $numbersToAdd = [];

                                if ($numbers) {
                                    $index = 0;
                                    foreach ($properties as $property) {
                                        if (array_key_exists($keys['phone1'], $property)) {
                                            $originalPhoneNumber = $property[$keys['phone1']];
                                            $found = null;
                                            foreach ($numbers as $number) {
                                                $numberToAdd = Arr::get($number, 'number', '');
                                                if ($numberToAdd === $originalPhoneNumber) {
                                                    $found = $number;
                                                }
                                            }
                                            if ($found) {
                                                $found['request_id'] = $index + 1;
                                                $numbersToAdd []= $found;
                                            }
                                        }
                                        if (array_key_exists($keys['phone2'], $property)) {
                                            $originalPhoneNumber = $property[$keys['phone2']];
                                            $found = null;
                                            foreach ($numbers as $number) {
                                                $numberToAdd = Arr::get($number, 'number', '');
                                                if ($numberToAdd === $originalPhoneNumber) {
                                                    $found = $number;
                                                }
                                            }
                                            if ($found) {
                                                $found['request_id'] = $index + 1;
                                                $numbersToAdd []= $found;
                                            }
                                        }
                                        if (array_key_exists($keys['phone3'], $property)) {
                                            $originalPhoneNumber = $property[$keys['phone3']];
                                            $found = null;
                                            foreach ($numbers as $number) {
                                                $numberToAdd = Arr::get($number, 'number', '');
                                                if ($numberToAdd === $originalPhoneNumber) {
                                                    $found = $number;
                                                }
                                            }
                                            if ($found) {
                                                $found['request_id'] = $index + 1;
                                                $numbersToAdd []= $found;
                                            }
                                        }
                                        $index++;
                                    }
                                }

                                foreach ($numbersToAdd as $number) {
                                    foreach ($createdProperties as $createdProperty) {
                                        if ($number['request_id'] === $createdProperty['request_id']) {
                                            $propertyId = $createdProperty['id'];
                                            $error = Arr::get($number, 'error', null);
                                            if (!$error) {
                                                $numberToAdd = Arr::get($number, 'number', '');
                                                $type = Arr::get($number, 'type', '');
                                                if ($numberToAdd) {
                                                    $propertyPhoneService->create(
                                                        array(
                                                            'phone_number'          => $numberToAdd,
                                                            'property_id'           => $propertyId,
                                                            'is_manually_updated'   => 0,
                                                            'type'                  => $type,
                                                        )
                                                    );
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                $offset++;
            } while(($offset * $pageSize <= 20000) && ($offset * $pageSize <= $propertyCount));
        }

        $failureCount = $propertyCount - $count - $existingCount;

        // if ($count > 0) {
        $oneSignalService->sendPropertyImportNotification($userId, $count, $failureCount, $existingCount);
        // }
    }

    protected function searchedAddressSort($address1, $address2)
    {
        return $address1['request_id'] > $address2['request_id'];
    }

    protected function normalizedAddressSort($address1, $address2)
    {
        return $address1['requestId'] > $address2['requestId'];
    }
}

<?php

namespace App\Services;

use App\Repositories\SkipTracingRepository;
use ArrayHelpers\Arr;
use App\Http\Helpers\PhoneNumberHelper;
use App\Models\Team;
use Log;

/**
 * Class SkipTracingService
 *
 * @package App\Http\Services
 */
class SkipTracingService extends BaseService
{
    protected $repository;
    protected $skipTracingRepository;
    protected $propertyPhoneService;
    protected $propertyEmailService;
    protected $propertyHistoryService;
    protected $propertyService;

    /**
     * SkipTracingService constructor.
     *
     * @param SkipTracingRepository $skipTracingRepository
     */
    public function __construct(
        SkipTracingRepository $skipTracingRepository,
        PropertyHistoryService $propertyHistoryService,
        PropertyPhoneService $propertyPhoneService,
        PropertyEmailService $propertyEmailService,
        PropertyService $propertyService
    )
    {
        $this->repository = $skipTracingRepository;
        $this->propertyHistoryService = $propertyHistoryService;
        $this->propertyPhoneService = $propertyPhoneService;
        $this->propertyEmailService = $propertyEmailService;
        $this->propertyService = $propertyService;
    }

    public function findAllByPropertyId($propertyId)
    {
        return $this->repository->findAllByPropertyId($propertyId);
    }

    public function skipTracing($properties, $teamId, $userId)
    {
        $count = 0;
        $items = $this->skipTracingProperties($properties);

        $result = [];

        if ($items) {
            foreach($items as $item) {
                // $propertyId = $properties[$key]['id'];
                $owner = Arr::get($item, 'owner', null);
                $request = Arr::get($item, 'request', null);
                if ($owner) {
                    $propertyId = Arr::get($request, 'requestId', null);
                    $phones = Arr::get($owner, 'phones', []);
                    $emails = Arr::get($owner, 'emails', []);
                    $fetched = false;

                    if ($propertyId) {
                        $this->propertyPhoneService->removeAllByPropertyId($propertyId);
                        $this->propertyEmailService->removeAllByPropertyId($propertyId);

                        $phonesToReturn = [];
                        $emailsToReturn = [];

                        foreach($phones as $phone) {
                            $phoneNumber = PhoneNumberHelper::formatToSimple($phone['number']);
                            $phoneNumbers = $this->propertyPhoneService->findAllByPropertyIdAndPhoneNumber($propertyId, $phoneNumber);
                            if (!count($phoneNumbers)) {
                                $type = Arr::get($phone, 'type', null);
                                $data = array(
                                    'phone_number'          => $phoneNumber,
                                    'property_id'           => $propertyId,
                                    'is_manually_updated'   => 0,
                                    'type'                  => $type
                                );
                                $this->propertyPhoneService->create($data);
                                $fetched = true;
                                $phonesToReturn []= array(
                                    'type'          => $type,
                                    'phone_number'  => $phoneNumber
                                );
                            }
                        }
                        foreach($emails as $email) {
                            $emailAddresses = $this->propertyEmailService->findAllByPropertyIdAndEmail($propertyId, $email);
                            if (!count($emailAddresses)) {
                                $data = array(
                                    'email'                 => $email,
                                    'property_id'           => $propertyId,
                                    'is_manually_updated'   => 0
                                );
                                $this->propertyEmailService->create($data);
                                $fetched = true;
                                $emailsToReturn []= array(
                                    'type'   => '',
                                    'email'  => $email
                                );
                            }
                        }

                        if ($fetched) {
                            $count++;
                            $now = date("Y-m-d h:i:s", time());
                            $this->propertyService->update($propertyId, array('skip_tracing_date' => $now));
                            $data = array(
                                'user_id'       => $userId,
                                'description'   => 'did skip Tracing.',
                                'type'          => 'skip tracing',
                                'property_id'   => $propertyId
                            );
                            $this->propertyHistoryService->create($data);
                            $result []= array(
                                'property_id'       => $propertyId,
                                'emails'            => $emailsToReturn,
                                'phones'            => $phonesToReturn
                            );
                        }
                    }
                }
            }
        }

        $team = Team::find($teamId);
        $skipTracedCount = $team['skip_tracing_count'];
        $skipTracedCount += $count;
        Team::where('id', $teamId)->update(['skip_tracing_count' => $skipTracedCount]);

        return array(
            'count'     => $count,
            'result'    => $result
        );
    }

    protected function skipTracingProperties($properties)
    {
        $apiBase = config('services.skipTracing.api_base');
        $apiKey = config('services.skipTracing.api_key');

        $result = [];

        $data = array(
            'requests' => array()
        );

        foreach ($properties as $property) {
            $data['requests'][] = array(
                'requestId'         => $property['id'],
                'firstName'         => $property['Owner1FirstName'],
                'lastName'          => $property['Owner1LastName'],
                'address'           => $property['CO_Mail_Street_Address'],
                'city'              => $property['CO_Mailing_City'],
                'state'             => $property['CO_Mailing_State'],
                'zip'               => $property['CO_Mailing_Zip_Code'],
                'mailingAddress'    => $property['CO_Mail_Street_Address'],
                'mailingCity'       => $property['CO_Mailing_City'],
                'mailingState'      => $property['CO_Mailing_State'],
                'mailingZip'        => $property['CO_Mailing_Zip_Code'],
            );
        }

        $data = json_encode($data);
        Log::info('Skip Tracing = ' . $data);
        $authorization = "Authorization: Bearer " . $apiKey;

        $curl = curl_init($apiBase . '/v1/skip-trace');
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            $authorization
        ));
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        $response = curl_exec($curl);

        if(curl_errno($curl)){
            return null;
        }
        curl_close($curl);

        $result = json_decode($response, true);
        $properties = $result['results']['properties'];

        return $properties;
    }
}

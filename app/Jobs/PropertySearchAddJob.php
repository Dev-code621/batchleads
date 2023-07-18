<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Models\OneSignal;
use App\Repositories\OneSignalRepository;
use App\Models\UserNotificationSetting;
use App\Repositories\UserNotificationSettingRepository;
use App\Services\OneSignalService;
use ArrayHelpers\Arr;
use App\Models\PropertyImage;
use App\Repositories\PropertyImageRepository;
use App\Services\PropertyImageService;

class PropertySearchAddJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $params;
    protected $userId;
    protected $teamId;
    protected $propertyService;
    protected $oneSignalService;
    protected $subscribedPlanName;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($params, $userId, $teamId, $propertyService, $subscribedPlanName)
    {
        $this->params = $params;
        $this->userId = $userId;
        $this->teamId = $teamId;
        $this->propertyService = $propertyService;
        $this->subscribedPlanName = $subscribedPlanName;
        $user = new User;
        $userRepository = new UserRepository($user);
        $oneSignal = new OneSignal;
        $oneSignalRepository = new OneSignalRepository($oneSignal);
        $userNotificationSetting = new UserNotificationSetting;
        $userNotificationSettingRepository = new UserNotificationSettingRepository($userNotificationSetting);
        $this->oneSignalService = new OneSignalService($userRepository, $oneSignalRepository, $userNotificationSettingRepository);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $propertyImage = new PropertyImage;
        $propertyImageRepository = new PropertyImageRepository($propertyImage);
        $propertyImageService = new PropertyImageService($propertyImageRepository);

        $searchMode = $this->params['search_mode'];
        if ($searchMode === 'zip') {
            $search = array(
                'searchCriteria'    => array(
                    'propertyAddress'   => array (
                        'zip'   => array(
                            'equals'    => $this->params['filter']['searchKey']
                        )
                    )
                )
            );
        } else if ($searchMode === 'county' || $searchMode === 'city') {
            $search = array(
                'searchCriteria'    => array(
                    'query'   =>  $this->params['filter']['searchKey']
                )
            );
        } else if ($searchMode === 'region') {
            $region = $this->params['filter']['region'];
            $geoPoints = [];
            foreach ($region as $point) {
                $geoPoints[] = array(
                    'latitude'  => $point['lat'],
                    'longitude' => $point['lon'],
                );
            }

            $search = array(
                'searchCriteria'    => array(
                    'propertyAddress'   => array (
                        'geoLocationPolygon'   => array(
                            'geoPoints'    => $geoPoints
                        )
                    )
                )
            );
        }

        $successCount = 0;
        $failureCount = 0;
        $page = 1;
        $pageSize = 500;

        $search = $this->propertyService->buildSearchParams($search, $this->params['filter'], $this->subscribedPlanName);
        do {
            $properties = [];
            $search['options'] = array(
                'skip'                  => ($page - 1) * $pageSize,
                'take'                  => $pageSize,
                'extractResultCount'    => true,
                'hideMeta'              => false,
            );

            $result = $this->propertyService->propertySearch($search);
            if ($result !== 404) {
                $properties = $result['items'];
                foreach ($properties as $property) {
                    if (!$this->isPropertyExcluded($property)) {
                        $property['status'] = 'New';
                        $property['user_id'] = $this->userId;
                        $property['team_id'] = $this->teamId;
                        $property['folder_id'] = $this->params['folder_id'];

                        $hash = Arr::get($property, 'address_hash', null);
                        $find = $this->propertyService->findWhereCount(
                            array(
                                'address_hash'  => $hash,
                                'team_id'       => $this->teamId
                            )
                        );
                        if ($find === 0) {
                            $result = $this->propertyService->create($property);
                            if ($result) {
                                $successCount++;
                                $lat = $result['location_latitude'];
                                $lon = $result['location_longitude'];
                                $propertyImageService->createStreetViewImage($result['id'], $lat, $lon);
                            } else {
                                $failureCount++;
                            }
                        } else {
                            $failureCount++;
                        }
                    }
                }
            }
            $page++;
        } while(intval($this->params['total']) >= ($page - 1) * $pageSize);

        $this->oneSignalService->sendPropertyAddNotification($this->userId, $successCount, $failureCount);
    }

    protected function isPropertyExcluded($property)
    {
        $excluded = false;
        $excludedHashes = Arr::get($this->params, 'excluded_hashes', []);
        foreach ($excludedHashes as $hash) {
            if ($hash === $property['address_hash']) {
                $excluded = true;
            }
        }

        return $excluded;
    }
}

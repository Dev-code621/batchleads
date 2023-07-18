<?php

namespace App\Http\Cron;

use App\Models\Property;
use App\Repositories\PropertyRepository;
use App\Services\PropertyService;
use App\Services\OneSignalService;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Models\OneSignal;
use App\Repositories\OneSignalRepository;
use App\Models\UserNotificationSetting;
use App\Repositories\UserNotificationSettingRepository;

class NotificationCron
{
    protected $propertyService;
    protected $oneSignalService;

    public function __construct()
    {
        $property = new Property;
        $propertyRepository = new PropertyRepository($property);
        $this->propertyService = new PropertyService($propertyRepository);

        $user = new User;
        $userRepository = new UserRepository($user);

        $oneSignal = new OneSignal;
        $oneSignalRepository = new OneSignalRepository($oneSignal);

        $userNotificationSetting = new UserNotificationSetting;
        $userNotificationSettingRepository = new UserNotificationSettingRepository($userNotificationSetting);

        $this->oneSignalService = new OneSignalService($userRepository, $oneSignalRepository, $userNotificationSettingRepository);
    }

    public function __invoke()
    {
        $countInfos = $this->propertyService->getDailyAddedCountInfos();
        $this->oneSignalService->sendDailyAddedPropertyNotification($countInfos);
    }
}

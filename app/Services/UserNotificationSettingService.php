<?php

namespace App\Services;

use App\Repositories\UserNotificationSettingRepository;


/**
 * Class UserNotificationSettingService
 *
 * @package App\Http\Services
 */
class UserNotificationSettingService extends BaseService
{
    /**
     * UserNotificationSettingService constructor.
     *
     * @param UserNotificationSettingRepository     $repository
     */
    public function __construct(UserNotificationSettingRepository $repository)
    {
        $this->repository = $repository;
    }
}

<?php

namespace App\Services;

use App\Repositories\AutoRechargeSettingRepository;


/**
 * Class AutoRechargeSettingService
 *
 * @package App\Http\Services
 */
class AutoRechargeSettingService extends BaseService
{
    /**
     * AutoRechargeSettingService constructor.
     *
     * @param AutoRechargeSettingRepository     $repository
     */
    public function __construct(AutoRechargeSettingRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAutoRechargeSettingByTeamId($teamId)
    {
        return $this->repository->getAutoRechargeSettingByTeamId($teamId);
    }
}

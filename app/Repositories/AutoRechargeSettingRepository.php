<?php
namespace App\Repositories;

use App\Models\AutoRechargeSetting;

/**
 * Class AutoRechargeSettingRepository
 *
 * @package App\Http\Repositories
 */
class AutoRechargeSettingRepository extends BaseRepository
{
    /**
     * AutoRechargeSettingRepository constructor.
     *
     * @param AutoRechargeSetting $model
     */
    public function __construct(AutoRechargeSetting $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return AutoRechargeSettingRepository|null
     */
    public function create(array $data): ?AutoRechargeSetting
    {
        $addon = $this->model->newInstance();
        $addon->user_id = $data['user_id'] ?? null;
        $addon->team_id = $data['team_id'] ?? null;
        $addon->status = $data['status'] ?? false;
        $addon->threshold = $data['threshold'] ?? 0;
        $addon->credit_package_id = $data['credit_package_id'] ?? 1;

        return $addon->save() ? $addon : null;
    }

    public function getAutoRechargeSettingByTeamId($teamId)
    {
        return $this->findWhere(
            array(
                'team_id'   => $teamId
            )
        );
    }
}

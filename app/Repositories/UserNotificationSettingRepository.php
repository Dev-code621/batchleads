<?php
namespace App\Repositories;

use App\Models\UserNotificationSetting;

/**
 * Class UserNotificationSettingRepository
 *
 * @package App\Http\Repositories
 */
class UserNotificationSettingRepository extends BaseRepository
{
    /**
     * UserNotificationSettingRepository constructor.
     *
     * @param UserNotificationSetting $model
     */
    public function __construct(UserNotificationSetting $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return UserNotificationSetting|null
     */
    public function create(array $data): ?UserNotificationSetting
    {
        $setting = $this->model->newInstance();
        $setting->notification_type = $data['notification_type'] ?? null;
        $setting->enabled = $data['enabled'] ?? 1;
        $setting->user_id = $data['user_id'] ?? null;
        $setting->name = $data['name'] ?? null;
        $setting->description = $data['description'] ?? null;

        return $setting->save() ? $setting : null;
    }

    /**
     * @param array $params
     *
     * @return array
     */
    public function search(array $params)
    {
        $orderBy = $params['orderBy'] ?? 'created_at';
        $order = $params['order'] ?? 'desc';
        $userId = $params['userId'] ?? null;

        $data = $this->model;
        if ($userId) {
            $data = $data->where('user_id', $userId);
        }

        $data = $data->orderBy($orderBy, $order)
            ->get();

        return $data;
    }
}

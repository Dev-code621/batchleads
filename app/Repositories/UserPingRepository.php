<?php
namespace App\Repositories;

use App\Models\UserPing;

/**
 * Class UserPingRepository
 *
 * @package App\Http\Repositories
 */
class UserPingRepository extends BaseRepository
{
    /**
     * UserPingRepository constructor.
     *
     * @param UserPing $model
     */
    public function __construct(UserPing $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return UserPing|null
     */
    public function create(array $data): ?UserPing
    {
        $model = $this->model->newInstance();
        $model->user_id = $data['user_id'] ?? null;
        $model->latitude = $data['latitude'] ?? null;
        $model->longitude = $data['longitude'] ?? null;
        $model->is_tracking = $data['is_tracking'] ?? null;

        $routeStr = '[]';
        if (array_key_exists('route', $data)) {
            $route = $data['route'];
            $routeStr = '[';
            foreach ($route as $key => $item) {
                $routeStr .= '{';
                $routeStr .= '"latitude":' . $item['latitude'] . ',"longitude":' . $item['longitude'];
                $routeStr .= '}';
                if ($key !== count($route) - 1) {
                    $routeStr .= ',';
                }
            }
            $routeStr .= ']';
        }

        $model->route = $routeStr;

        return $model->save() ? $model : null;
    }
}

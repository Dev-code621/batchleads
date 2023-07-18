<?php
namespace App\Repositories;

use App\Models\UserFp;

/**
 * Class UserFpRepository
 *
 * @package App\Http\Repositories
 */
class UserFpRepository extends BaseRepository
{
    /**
     * UserFpRepository constructor.
     *
     * @param UserFp $userFp
     */
    public function __construct(UserFp $userFp)
    {
        $this->model = $userFp;
    }

    /**
     * @param array $data
     *
     * @return UserFp|null
     */
    public function create(array $data): ?UserFp
    {
        $model = $this->model->newInstance();
        $model->user_id = $data['user_id'] ?? null;
        $model->ref_id = $data['ref_id'] ?? null;
        $model->auth_token = $data['auth_token'] ?? null;
        $model->tracking_ref_id = $data['tracking_ref_id'] ?? null;

        return $model->save() ? $model : null;
    }
}

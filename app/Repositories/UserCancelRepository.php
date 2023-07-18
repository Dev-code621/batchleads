<?php
namespace App\Repositories;

use App\Models\UserCancel;

/**
 * Class UserCancelRepository
 *
 * @package App\Http\Repositories
 */
class UserCancelRepository extends BaseRepository
{
    /**
     * UserCancelRepository constructor.
     *
     * @param UserCancel $userCancel
     */
    public function __construct(UserCancel $userCancel)
    {
        $this->model = $userCancel;
    }

    /**
     * @param array $data
     *
     * @return UserCancel|null
     */
    public function create(array $data): ?UserCancel
    {
        $model = $this->model->newInstance();
        $model->user_id = $data['user_id'] ?? null;
        $model->cancel_at = $data['cancel_at'] ?? null;

        return $model->save() ? $model : null;
    }
}

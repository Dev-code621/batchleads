<?php
namespace App\Repositories;

use App\Models\OneSignal;

/**
 * Class OneSignalRepository
 *
 * @package App\Http\Repositories
 */
class OneSignalRepository extends BaseRepository
{
    /**
     * OneSignalRepository constructor.
     *
     * @param OneSignal $oneSignal
     */
    public function __construct(OneSignal $oneSignal)
    {
        $this->model = $oneSignal;
    }

    /**
     * @param array $data
     *
     * @return OneSignal|null
     */
    public function create(array $data): ?OneSignal
    {
        $oneSignal = $this->model->newInstance();
        $oneSignal->user_id = $data['user_id'] ?? null;
        $oneSignal->one_signal_user_id = $data['one_signal_user_id'] ?? null;

        return $oneSignal->save() ? $oneSignal : null;
    }

    public function getAllByUserId($userId)
    {
        return $this->findWhere(array(
            'user_id' => $userId
        ));
    }

    public function deleteByOneSignalUserId($oneSignalUserId)
    {
        return $this->deleteAll(array(
            'one_signal_user_id' => $oneSignalUserId
        ));
    }
}

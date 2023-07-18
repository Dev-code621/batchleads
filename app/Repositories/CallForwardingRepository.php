<?php
namespace App\Repositories;

use App\Models\CallForwarding;

/**
 * Class CallForwardingRepository
 *
 * @package App\Http\Repositories
 */
class CallForwardingRepository extends BaseRepository
{
    /**
     * CallForwardingRepository constructor.
     *
     * @param CallForwarding $model
     */
    public function __construct(CallForwarding $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return CallForwardingRepository|null
     */
    public function create(array $data): ?CallForwarding
    {
        $forwarding = $this->model->newInstance();
        $forwarding->user_id = $data['user_id'] ?? null;
        $forwarding->phone_number = $data['phone_number'] ?? null;

        return $forwarding->save() ? $forwarding : null;
    }
}

<?php
namespace App\Repositories;

use App\Models\ZapierSubscribe;

/**
 * Class ZapierSubscribeRepository
 *
 * @package App\Http\Repositories
 */
class ZapierSubscribeRepository extends BaseRepository
{
    /**
     * ZapierSubscribeRepository constructor.
     *
     * @param ZapierSubscribe $model
     */
    public function __construct(ZapierSubscribe $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return ZapierSubscribe|null
     */
    public function create(array $data): ?ZapierSubscribe
    {
        $model = $this->model->newInstance();
        $model->user_id = $data['user_id'] ?? null;
        $model->hookUrl = $data['hookUrl'] ?? null;
        $model->type = $data['type'] ?? null;

        return $model->save() ? $model : null;
    }
}

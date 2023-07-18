<?php
namespace App\Repositories;

use App\Models\SentMessageCount;

/**
 * Class SentMessageCountRepository
 *
 * @package App\Http\Repositories
 */
class SentMessageCountRepository extends BaseRepository
{
    /**
     * SentMessageCountRepository constructor.
     *
     * @param SentMessageCount $model
     */
    public function __construct(SentMessageCount $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return SentMessageCount|null
     */
    public function create(array $data): ?SentMessageCount
    {
        $model = $this->model->newInstance();
        $model->user_id = $data['user_id'] ?? null;
        $model->count = $data['count'] ?? 0;

        return $model->save() ? $model : null;
    }
}

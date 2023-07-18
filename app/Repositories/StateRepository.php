<?php
namespace App\Repositories;

use App\Models\State;

/**
 * Class StateRepository
 *
 * @package App\Http\Repositories
 */
class StateRepository extends BaseRepository
{
    /**
     * StateRepository constructor.
     *
     * @param State $model
     */
    public function __construct(State $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return State|null
     */
    public function create(array $data): ?State
    {
        $model = $this->model->newInstance();
        $model->name = $data['name'] ?? null;
        $model->user_id = $data['user_id'] ?? 1;
        $model->team_id = $data['team_id'] ?? null;
        $model->color = $data['color'] ?? null;
        $model->icon = $data['icon'] ?? null;

        return $model->save() ? $model : null;
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
        $perPage = $params['per_page'] ?? 100;
        $search = $params['search'] ?? '';
        $teamId = $params['team_id'] ?? null;
        $userId = $params['user_id'] ?? null;
        $page = $params['page'] ?? null;

        $data = $this->model;
        if ($userId) {
            $data = $data->where('user_id', $userId);
        }
        if ($teamId) {
            $data = $data->where('team_id', $teamId);
        }
        if ($search) {
            $data = $data->whereRaw('lower(name) like (?)', '%' . strtolower($search) . '%');
        }

        $total = $data->count();
        $data = $data->orderBy($orderBy, $order)
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $result = array(
            'total'          => $total,
            'page'           => $page,
            'count_per_page' => $perPage,
            'count'          => $data->count(),
            'data'           => $data,
        );

        return $result;
    }
}

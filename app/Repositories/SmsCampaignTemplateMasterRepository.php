<?php
namespace App\Repositories;

use App\Models\SmsCampaignTemplateMaster;

/**
 * Class SmsCampaignTemplateMasterRepository
 *
 * @package App\Http\Repositories
 */
class SmsCampaignTemplateMasterRepository extends BaseRepository
{
    /**
     * SmsCampaignTemplateMasterRepository constructor.
     *
     * @param SmsCampaignTemplateMaster $model
     */
    public function __construct(SmsCampaignTemplateMaster $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return SmsCampaignTemplateMaster|null
     */
    public function create(array $data): ?SmsCampaignTemplateMaster
    {
        $model = $this->model->newInstance();
        $model->name = $data['name'] ?? null;
        $model->user_id = $data['user_id'] ?? null;
        $model->team_id = $data['team_id'] ?? null;

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
        $perPage = $params['per_page'] ?? 10;
        $search = $params['search'] ?? '';
        $userId = $params['userId'] ?? null;
        $teamId = $params['team_id'] ?? null;
        $page = $params['page'] ?? null;

        $data = SmsCampaignTemplateMaster::whereRaw('lower(name) like (?)', '%' . strtolower($search) . '%');
        if ($userId) {
            $data = $data->where('user_id', $userId);
        }
        if ($teamId) {
            $data = $data->where('team_id', $teamId);
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

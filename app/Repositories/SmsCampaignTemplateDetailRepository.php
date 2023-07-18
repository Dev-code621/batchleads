<?php
namespace App\Repositories;

use App\Models\SmsCampaignTemplateDetail;

/**
 * Class SmsCampaignTemplateDetailRepository
 *
 * @package App\Http\Repositories
 */
class SmsCampaignTemplateDetailRepository extends BaseRepository
{
    /**
     * SmsCampaignTemplateDetailRepository constructor.
     *
     * @param SmsCampaignTemplateDetail $model
     */
    public function __construct(SmsCampaignTemplateDetail $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return SmsCampaignTemplateDetail|null
     */
    public function create(array $data): ?SmsCampaignTemplateDetail
    {
        $model = $this->model->newInstance();
        $model->template_master_id = $data['template_master_id'] ?? null;
        $model->content = $data['content'] ?? null;
        $model->day = $data['day'] ?? 0;

        return $model->save() ? $model : null;
    }

    public function getCampaignTemplateDetail(array $params)
    {
        return $this->model->where('template_master_id', $params['template_master_id'])
            ->where('day', $params['day'])
            ->get();
    }

    public function checkFurtherDay(array $params)
    {
        return $this->model->where('template_master_id', $params['template_master_id'])
            ->where('day', '>=',  $params['day'])
            ->count();
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
        $page = $params['page'] ?? null;

        $data = SmsCampaignTemplateDetail::whereRaw('lower(content) like (?)', '%' . strtolower($search) . '%');

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

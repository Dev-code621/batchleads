<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\MailTemplateStyle;

/**
 * Class MailTemplateStyleRepository
 *
 * @package App\Http\Repositories
 */
class MailTemplateStyleRepository extends BaseRepository
{
    /**
     * MailTemplateStyleRepository constructor.
     *
     * @param MailTemplateStyle $model
     */
    public function __construct(MailTemplateStyle $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return MailTemplateStyle|null
     */
    public function create(array $data): ?MailTemplateStyle
    {
        $model = $this->model->newInstance();
        $model->name = $data['name'] ?? null;
        $model->front_content = $data['front_content'] ?? null;
        $model->back_content = $data['back_content'] ?? null;
        $model->front_preview_image_url = $data['front_preview_image_url'] ?? null;
        $model->back_preview_image_url = $data['back_preview_image_url'] ?? null;

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
        $page = $params['page'] ?? null;

        $data = $this->model;

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

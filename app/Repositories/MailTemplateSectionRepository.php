<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\MailTemplateSection;

/**
 * Class MailTemplateSectionRepository
 *
 * @package App\Http\Repositories
 */
class MailTemplateSectionRepository extends BaseRepository
{
    /**
     * MailTemplateSectionRepository constructor.
     *
     * @param MailTemplateSection $model
     */
    public function __construct(MailTemplateSection $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return MailTemplateSection|null
     */
    public function create(array $data): ?MailTemplateSection
    {
        $model = $this->model->newInstance();
        $model->name = $data['name'] ?? null;
        $model->template_id = $data['template_id'] ?? null;
        $model->content = $data['content'] ?? null;

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

        $data = DB::table('mail_template_sections');

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

    public function removeAllByTemplateId($templateId)
    {
        $this->model->where('template_id', $templateId)->delete();
    }
}

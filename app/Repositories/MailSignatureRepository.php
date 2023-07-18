<?php
namespace App\Repositories;

use App\Models\MailSignature;

/**
 * Class MailSignatureRepository
 *
 * @package App\Http\Repositories
 */
class MailSignatureRepository extends BaseRepository
{
    /**
     * MailSignatureRepository constructor.
     *
     * @param MailSignature $model
     */
    public function __construct(MailSignature $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return MailSignature|null
     */
    public function create(array $data): ?MailSignature
    {
        $model = $this->model->newInstance();
        $model->user_id = $data['user_id'] ?? null;
        $model->team_id = $data['team_id'] ?? null;
        $model->label = $data['label'] ?? null;
        $model->sign_off = $data['sign_off'] ?? null;
        $model->name = $data['name'] ?? null;
        $model->contact_phone = $data['contact_phone'] ?? null;
        $model->contact_email = $data['contact_email'] ?? null;
        $model->contact_website = $data['contact_website'] ?? null;
        $model->address_line1 = $data['address_line1'] ?? null;
        $model->address_line2 = $data['address_line2'] ?? null;
        $model->address_city = $data['address_city'] ?? null;
        $model->address_state = $data['address_state'] ?? null;
        $model->address_zip = $data['address_zip'] ?? null;
        $model->disclosure_agreement = $data['disclosure_agreement'] ?? null;

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

        $data = $this->model;
        if ($userId) {
            $data = $data->where('user_id', $userId);
        }
        if ($teamId) {
            $data = $data->where('team_id', $teamId);
        }
        if ($search) {
            $data = $data->whereRaw('lower(label) like (?)', '%' . strtolower($search) . '%');
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

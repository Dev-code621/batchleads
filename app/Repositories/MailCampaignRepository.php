<?php
namespace App\Repositories;

use App\Models\MailCampaign;

/**
 * Class MailCampaignRepository
 *
 * @package App\Http\Repositories
 */
class MailCampaignRepository extends BaseRepository
{
    /**
     * MailCampaignRepository constructor.
     *
     * @param MailCampaign $mailCampaign
     */
    public function __construct(MailCampaign $mailCampaign)
    {
        $this->model = $mailCampaign;
    }

    /**
     * @param array $data
     *
     * @return MailCampaign|null
     */
    public function create(array $data): ?MailCampaign
    {
        $mailCampaign = $this->model->newInstance();
        $mailCampaign->user_id = $data['user_id'] ?? null;
        $mailCampaign->team_id = $data['team_id'] ?? null;
        $mailCampaign->template_id = $data['template_id'] ?? null;
        $mailCampaign->title = $data['title'] ?? null;
        $mailCampaign->description = $data['description'] ?? null;
        $mailCampaign->send_date = $data['send_date'] ?? null;
        $mailCampaign->finished = $data['finished'] ?? 0;

        return $mailCampaign->save() ? $mailCampaign : null;
    }

    public function getCampaigns($params)
    {
        $finished = $params['finished'] ?? null;
        $data = $this->model->where('finished', $finished);
        $data = $data->whereDate('send_date', '<=', date('Y-m-d'))
            ->get();

        return $data;
    }

    public function getCampaignsByTemplateId($templateId)
    {
        return $this->model->where('template_id', $templateId)->get();
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
        $finished = $params['finished'] ?? '';
        $userId = $params['userId'] ?? null;
        $teamId = $params['team_id'] ?? null;
        $page = $params['page'] ?? null;

        $data = $this->model->where(function($query) use($search) {
            $query->whereRaw('lower(title) like (?)', '%' . strtolower($search) . '%')
                ->orWhereRaw('lower(description) like (?)', '%' . strtolower($search) . '%');
        });
        if ($userId) {
            $data = $data->where('user_id', $userId);
        }
        if ($teamId) {
            $data = $data->where('team_id', $teamId);
        }
        if ($finished) {
            $data = $data->where('finished', $finished);
        }
        $data = $data->with('mailTemplate');
        // $data = $data->with('mailCampaignProperties');

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

    public function findNotCancelledCountByPropertyId($propertyId)
    {
        $data = $this->model->with('mailCampaignProperties');
        $data = $data->whereNotIn('finished', [2]);
        $data = $data->whereHas('mailCampaignProperties', function($query) use($propertyId) {
            $query->where('property_id', $propertyId);
        });

        return $data->count();
    }
}

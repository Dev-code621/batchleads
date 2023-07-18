<?php
namespace App\Repositories;

use App\Models\SmsCampaign;
use App\Models\SmsCampaignProperty;
use App\Models\Property;

/**
 * Class SmsCampaignRepository
 *
 * @package App\Http\Repositories
 */
class SmsCampaignRepository extends BaseRepository
{
    /**
     * SmsCampaignRepository constructor.
     *
     * @param SmsCampaign $smsCampaign
     */
    public function __construct(SmsCampaign $smsCampaign)
    {
        $this->model = $smsCampaign;
    }

    /**
     * @param array $data
     *
     * @return SmsCampaign|null
     */
    public function create(array $data): ?SmsCampaign
    {
        $smsCampaign = $this->model->newInstance();
        $smsCampaign->user_id = $data['user_id'] ?? null;
        $smsCampaign->team_id = $data['team_id'] ?? null;
        $smsCampaign->sms_campaign_template_master_id	= $data['template_master_id'] ?? null;
        $smsCampaign->current_day = 0;
        $smsCampaign->title = $data['title'] ?? null;
        $smsCampaign->description = $data['description'] ?? null;
        $smsCampaign->start_date = $data['start_date'] ?? null;
        $smsCampaign->finished = false;

        return $smsCampaign->save() ? $smsCampaign : null;
    }

    public function getCampaigns($params)
    {
        $finished = $params['finished'] ?? null;
        $data = SmsCampaign::where('finished', $finished);
        $data = $data->whereDate('start_date', '<=', date('Y-m-d'))->get();
        return $data;
    }

    public function getCampaignsByTemplateMasterId($templateId)
    {
        return $this->model->where('sms_campaign_template_master_id', $templateId)->get();
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

        $data = SmsCampaign::where(function($query) use($search) {
            $query->whereRaw('lower(title) like (?)', '%' . strtolower($search) . '%')
                ->orWhereRaw('lower(description) like (?)', '%' . strtolower($search) . '%');
        });
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

    public function findNotCancelledCountByPropertyId($propertyId)
    {
        $data = $this->model->with('smsCampaignProperties');
        $data = $data->whereHas('smsCampaignProperties', function($query) use($propertyId) {
            $query->where('property_id', $propertyId);
        });
        $data = $data->whereNotIn('finished', [2]);

        return $data->count();
    }

    public function getCampaignsByPhoneNumberAndUserId($phoneNumber, $userId)
    {
        $properties = Property::whereHas('phones', function($query) use($phoneNumber) {
            $query->where('phone_number', $phoneNumber);
        });

        $smsCampaignProperties = SmsCampaignProperty::with('property');
        $smsCampaignProperties = $smsCampaignProperties->whereHas('property', function($query) use($properties) {
            $query->whereIn('property_id', $properties->select('id'));
        });

        $data = $this->model->with('smsCampaignProperties');
        $data = $data->where('user_id', $userId);
        $data = $data->whereHas('smsCampaignProperties', function($query) use($smsCampaignProperties) {
            $query->whereIn('sms_campaign_id', $smsCampaignProperties->select('sms_campaign_id'));
        });

        return $data->get();
    }
}

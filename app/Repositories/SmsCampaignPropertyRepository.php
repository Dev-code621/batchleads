<?php
namespace App\Repositories;

use App\Models\SmsCampaignProperty;

/**
 * Class SmsCampaignPropertyRepository
 *
 * @package App\Http\Repositories
 */
class SmsCampaignPropertyRepository extends BaseRepository
{
    /**
     * SmsCampaignPropertyRepository constructor.
     *
     * @param SmsCampaignProperty $smsCampaignProperty
     */
    public function __construct(SmsCampaignProperty $smsCampaignProperty)
    {
        $this->model = $smsCampaignProperty;
    }

    /**
     * @param array $data
     *
     * @return SmsCampaignProperty|null
     */
    public function create(array $data): ?SmsCampaignProperty
    {
        $smsCampaignProperty = $this->model->newInstance();
        $smsCampaignProperty->sms_campaign_id = $data['sms_campaign_id'] ?? null;
        $smsCampaignProperty->property_id = $data['property_id'] ?? null;

        return $smsCampaignProperty->save() ? $smsCampaignProperty : null;
    }

    public function findAllByCampaignId($campaignId)
    {
        return $this->model->where('sms_campaign_id', $campaignId)->get();
    }

    public function removeIfCancelledCampaignProperty($propertyId)
    {
        $data = $this->model->with('smsCampaign');
        $data = $data->where('property_id', $propertyId);
        $data = $data->whereHas('smsCampaign', function($query) {
            $query->whereIn('finished', [2]);
        });

        return $data->delete();
    }

    public function removeIfCancelledCampaignProperties($propertyIds)
    {
        $data = $this->model->with('smsCampaign');
        $data = $data->whereIn('property_id', $propertyIds);
        $data = $data->whereHas('smsCampaign', function($query) {
            $query->whereIn('finished', [2]);
        });

        return $data->delete();
    }
}

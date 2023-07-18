<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\MailCampaignProperty;

/**
 * Class MailCampaignPropertyRepository
 *
 * @package App\Http\Repositories
 */
class MailCampaignPropertyRepository extends BaseRepository
{
    /**
     * MailCampaignPropertyRepository constructor.
     *
     * @param MailCampaignProperty $mailCampaignProperty
     */
    public function __construct(MailCampaignProperty $mailCampaignProperty)
    {
        $this->model = $mailCampaignProperty;
    }

    /**
     * @param array $data
     *
     * @return MailCampaignProperty|null
     */
    public function create(array $data): ?MailCampaignProperty
    {
        $mailCampaignProperty = $this->model->newInstance();
        $mailCampaignProperty->mail_campaign_id = $data['mail_campaign_id'] ?? null;
        $mailCampaignProperty->property_id = $data['property_id'] ?? null;
        $mailCampaignProperty->status = $data['status'] ?? 'other';
        $mailCampaignProperty->postcard_id = $data['postcard_id'] ?? null;

        return $mailCampaignProperty->save() ? $mailCampaignProperty : null;
    }

    public function setDeliveredByPostCardId($postCardId)
    {
        return DB::table('mail_campaign_properties')
                    ->where('postcard_id', $postCardId)
                    ->update(array('status' => 'delivered'));
    }

    public function findAllByCampaignId($campaignId)
    {
        return $this->model->where('mail_campaign_id', $campaignId)->get();
    }

    public function removeIfCancelledCampaignProperties($propertyIds)
    {
        $data = $this->model->with('mailCampaign');
        $data = $data->whereIn('property_id', $propertyIds);
        $data = $data->whereHas('mailCampaign', function($query) {
            $query->whereNotIn('finished', [0, 1]);
        });

        return $data->delete();
    }
}

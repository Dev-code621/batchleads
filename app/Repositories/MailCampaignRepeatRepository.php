<?php
namespace App\Repositories;

use App\Models\MailCampaignRepeat;

/**
 * Class MailCampaignRepeatRepository
 *
 * @package App\Http\Repositories
 */
class MailCampaignRepeatRepository extends BaseRepository
{
    /**
     * MailCampaignRepeatRepository constructor.
     *
     * @param MailCampaignRepeat $model
     */
    public function __construct(MailCampaignRepeat $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return MailCampaignRepeat|null
     */
    public function create(array $data): ?MailCampaignRepeat
    {
        $mailCampaignRepeat = $this->model->newInstance();
        $mailCampaignRepeat->mail_campaign_id = $data['mail_campaign_id'] ?? null;
        $mailCampaignRepeat->repeat_every = $data['repeat_every'] ?? null;
        $mailCampaignRepeat->total_mailers = $data['total_mailers'] ?? null;
        $mailCampaignRepeat->finished = $data['finished'] ?? 0;
        $mailCampaignRepeat->current_repeat = $data['current_repeat'] ?? 0;

        return $mailCampaignRepeat->save() ? $mailCampaignRepeat : null;
    }

    public function getRepeats(array $where = [])
    {
        $data = $this->model;
        $data = $data->where($where);
        $data = $data->orderBy('updated_at');
        $data = $data->with('mailCampaign');

        return $data->get();
    }

    public function findAllByCampaignId($campaignId)
    {
        return $this->model->where('mail_campaign_id', $campaignId)->get();
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class MailCampaignCancelRequest
 *
 * @package App\Http\Requests
 */
class MailCampaignCancelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'campaign_id'   => 'required|integer|exists:mail_campaigns,id'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['campaign_id'] = $this->route('campaignId');

        return $data;
    }
}

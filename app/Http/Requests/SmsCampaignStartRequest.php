<?php

namespace App\Http\Requests;

/**
 * Class SmsCampaignStartRequest
 * @package App\Http\Requests
 */
class SmsCampaignStartRequest extends ApiRequest
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
            'template_master_id'    => 'required|integer|exists:sms_campaign_template_masters,id',
            'property_ids'          => 'required|array',
            'property_ids.*'        => 'integer|exists:properties,id',
            'title'                 => 'required|string',
            'description'           => 'nullable|string',
            'start_date'            => 'required|date',
            'skiptracing'           => 'nullable|boolean'
        ];
    }
}

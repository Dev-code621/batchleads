<?php

namespace App\Http\Requests;

/**
 * Class CreateMailCampaignRequest
 * @package App\Http\Requests
 */
class CreateMailCampaignRequest extends ApiRequest
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
            'template_id'           => 'required|integer|exists:mail_templates,id',
            'send_date'             => 'required|date|max:255',
            'property_ids'          => 'required|array',
            'property_ids.*'        => 'integer|exists:properties,id',
            'title'                 => 'required|string',
            'description'           => 'required|string',
            'repeat_every'          => 'nullable|integer',
            'total_mailers'         => 'nullable|integer',
            'is_repeat'             => 'nullable|boolean'
        ];
    }
}

<?php
namespace App\Http\Requests;

/**
 * Class CreateSmsCampaignTemplateDetailRequest
 * @package App\Http\Requests
 */
class CreateSmsCampaignTemplateDetailRequest extends ApiRequest
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
            'template_master_id'    => 'required|integer',
            'content'               => 'required|string|max:255',
            'day'                   => 'integer'
        ];
    }
}

<?php
namespace App\Http\Requests;

/**
 * Class CreateSmsCampaignTemplateRequest
 * @package App\Http\Requests
 */
class CreateSmsCampaignTemplateRequest extends ApiRequest
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
            'name'              => 'required|string|max:255',
            'details'           => 'required|array',
            'details.*.day'     => 'required|integer',
            'details.*.content' => 'required|string'
        ];
    }

    public function messages()
    {
        return [
            'details.required'              => 'Need to add details.',
            'details.*.day.required'        => 'Day is required',
            'details.*.day.integer'         => 'Day must be integer',
            'details.*.content.required'    => 'Content is required',
        ];
    }
}

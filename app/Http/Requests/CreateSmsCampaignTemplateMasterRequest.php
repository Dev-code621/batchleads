<?php
namespace App\Http\Requests;

/**
 * Class CreateSmsCampaignTemplateMasterRequest
 * @package App\Http\Requests
 */
class CreateSmsCampaignTemplateMasterRequest extends ApiRequest
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
            'name' => 'required|string|max:255',
        ];
    }
}

<?php

namespace App\Http\Requests;

/**
 * Class StopAllCampaignsRequest
 * @package App\Http\Requests
 */
class StopAllCampaignsRequest extends ApiRequest
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
            'property_id'   => 'required|integer|exists:properties,id',
        ];
    }
}

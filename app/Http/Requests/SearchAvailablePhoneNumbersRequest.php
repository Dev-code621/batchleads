<?php

namespace App\Http\Requests;

/**
 * Class SearchAvailablePhoneNumbersRequest
 *
 * @package App\Http\Requests
 */
class SearchAvailablePhoneNumbersRequest extends ApiRequest
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
            'count'     => 'nullable|integer',
            'area_code' => 'nullable|string',
        ];
    }
}

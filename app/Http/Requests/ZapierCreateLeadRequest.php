<?php

namespace App\Http\Requests;

/**
 * Class ZapierCreateLeadRequest
 * @package App\Http\Requests
 */
class ZapierCreateLeadRequest extends ApiRequest
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
            'street'      => 'required|string|max:255',
            'city'        => 'required|string|max:255',
            'state'       => 'required|string|max:255',
            'zip'         => 'required|string|max:255',
        ];
    }
}

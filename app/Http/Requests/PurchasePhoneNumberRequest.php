<?php

namespace App\Http\Requests;

/**
 * Class PurchasePhoneNumberRequest
 * @package App\Http\Requests
 */
class PurchasePhoneNumberRequest extends ApiRequest
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
            'phone_number'   => 'required|string|max:255',
        ];
    }
}

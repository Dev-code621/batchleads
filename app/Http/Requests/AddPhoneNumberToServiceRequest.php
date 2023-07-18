<?php

namespace App\Http\Requests;

/**
 * Class AddPhoneNumberToServiceRequest
 *
 * @package App\Http\Requests
 */
class AddPhoneNumberToServiceRequest extends ApiRequest
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
            'phone_number_sid' => 'required|string|max:255'
        ];
    }
}

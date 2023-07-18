<?php

namespace App\Http\Requests;

/**
 * Class ForgotPasswordRequest
 *
 * @package App\Http\Requests
 */
class ForgotPasswordRequest extends ApiRequest
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
            'email' => 'email|required'
        ];
    }
}

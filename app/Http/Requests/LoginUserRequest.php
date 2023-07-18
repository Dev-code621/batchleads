<?php

namespace App\Http\Requests;

/**
 * Class LoginUserRequest
 *
 * @package App\Http\Requests
 */
class LoginUserRequest extends ApiRequest
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
            // 'email'        => 'required_without_all:phone|string|email|max:255',
            // 'phone'        => 'required_without_all:email|string|min:11',
            // 'password'     => 'required_without_all|string',
            // 'access_token' => 'required_with:email|string',
            'email'                 => 'required|email',
            'password'              => 'required|string',
            'one_signal_user_id'    => 'nullable|string|max:255',
            'skip_verification'     => 'nullable|boolean'
        ];
    }
}

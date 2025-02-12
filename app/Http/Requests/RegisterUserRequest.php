<?php

namespace App\Http\Requests;

/**
 * Class RegisterUserRequest
 *
 * @package App\Http\Requests
 */
class RegisterUserRequest extends ApiRequest
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
            'phone'             => 'required|string|unique:users,phone',
            'email'             => 'required|string|email|max:255|unique:users,email',
            'password'          => 'required|string|min:6',
            'token'             => 'nullable|string',
            'file'              => 'image|max:8000',
            'plan_index'        => 'nullable|integer',
            'tracking_ref_id'   => 'nullable|string|max:20'
        ];
    }
}

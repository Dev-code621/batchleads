<?php

namespace App\Http\Requests;

/**
 * Class InviteUserRequest
 * @package App\Http\Requests
 */
class InviteUserRequest extends ApiRequest
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
            'email'   => 'required|email|unique:users,email|unique:team_invitations,email',
        ];
    }
}

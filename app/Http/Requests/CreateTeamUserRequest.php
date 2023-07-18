<?php

namespace App\Http\Requests;

/**
 * Class CreateTeamUserRequest
 * @package App\Http\Requests
 */
class CreateTeamUserRequest extends ApiRequest
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
            'team_id' => 'required|integer',
            'user_id' => 'required|integer',
        ];
    }
}

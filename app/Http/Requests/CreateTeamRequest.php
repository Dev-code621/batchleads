<?php

namespace App\Http\Requests;

/**
 * Class CreateTeamRequest
 * @package App\Http\Requests
 */
class CreateTeamRequest extends ApiRequest
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
            'admin_user_id' => 'required|integer',
            'name'          => 'required|string|max:255',
        ];
    }
}

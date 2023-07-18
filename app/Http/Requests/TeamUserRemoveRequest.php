<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class TeamUserRemoveRequest
 *
 * @package App\Http\Requests
 */
class TeamUserRemoveRequest extends FormRequest
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
            'user_id'   => 'required|integer|exists:team_users,user_id'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['user_id'] = $this->route('userId');

        return $data;
    }
}

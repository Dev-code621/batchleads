<?php

namespace App\Http\Requests;

/**
 * Class LogoutUserRequest
 *
 * @package App\Http\Requests
 */
class LogoutUserRequest extends ApiRequest
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
            'one_signal_user_id'  => 'required|string|max:255'
        ];
    }
}

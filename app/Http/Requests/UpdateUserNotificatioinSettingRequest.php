<?php

namespace App\Http\Requests;

/**
 * Class UpdateUserNotificatioinSettingRequest
 * @package App\Http\Requests
 */
class UpdateUserNotificatioinSettingRequest extends ApiRequest
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
            'notification_type'     => 'required|string|max:255',
            'enabled'               => 'required|boolean',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

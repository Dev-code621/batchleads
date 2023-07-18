<?php

namespace App\Http\Requests;

/**
 * Class UpdateSkipTracingRequest
 * @package App\Http\Requests
 */
class UpdateSkipTracingRequest extends DefaultUpdateRequest
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
            'id'                 => 'required|integer',
            'property_id'        => 'required|integer',
            'email'              => 'email',
            'phone_number'       => 'phone:US',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

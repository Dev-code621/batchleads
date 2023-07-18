<?php

namespace App\Http\Requests;

/**
 * Class UpdatePropertyPhoneRequest
 * @package App\Http\Requests
 */
class UpdatePropertyPhoneRequest extends DefaultUpdateRequest
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
            'id'            => 'required|integer|exists:property_phones,id',
            'phone_number'  => 'required',
            'type'          => 'nullable|string|max:255'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

<?php

namespace App\Http\Requests;

/**
 * Class UpdatePropertyEmailRequest
 * @package App\Http\Requests
 */
class UpdatePropertyEmailRequest extends DefaultUpdateRequest
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
            'id'            => 'required|integer|exists:property_emails,id',
            'email'         => 'required|email',
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

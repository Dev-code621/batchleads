<?php

namespace App\Http\Requests;

/**
 * Class CreatePropertyEmailRequest
 * @package App\Http\Requests
 */
class CreatePropertyEmailRequest extends ApiRequest
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
            'property_id'   => 'required|integer|exists:properties,id',
            'email'       => 'required|string|email|max:255',
            'type'        => 'nullable|string|max:255'
        ];
    }
}

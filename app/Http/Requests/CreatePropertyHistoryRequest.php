<?php

namespace App\Http\Requests;

/**
 * Class CreatePropertyHistoryRequest
 * @package App\Http\Requests
 */
class CreatePropertyHistoryRequest extends ApiRequest
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
            'property_id'       => 'required|exists:properties,id',
            'description'       => 'required|string'
        ];
    }
}

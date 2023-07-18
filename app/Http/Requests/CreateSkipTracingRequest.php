<?php

namespace App\Http\Requests;

/**
 * Class CreateSkipTracingRequest
 * @package App\Http\Requests
 */
class CreateSkipTracingRequest extends ApiRequest
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
            'email'         => 'string|max:255',
            'phone_number'  => 'phone:US',
            'property_id'   => 'required|integer',
        ];
    }
}

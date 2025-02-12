<?php

namespace App\Http\Requests;

/**
 * Class UpdateAddOnRequest
 * @package App\Http\Requests
 */
class UpdateAddOnRequest extends ApiRequest
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
            'add_on'    => 'required|string|max:255',
        ];
    }
}

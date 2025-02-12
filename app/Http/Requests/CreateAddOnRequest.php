<?php

namespace App\Http\Requests;

/**
 * Class CreateAddOnRequest
 * @package App\Http\Requests
 */
class CreateAddOnRequest extends ApiRequest
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
            'add_on'    => 'required|in:street_view,driving_route',
        ];
    }
}

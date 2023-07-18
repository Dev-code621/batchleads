<?php

namespace App\Http\Requests;

/**
 * Class PropertySearchByDistanceRequest
 * @package App\Http\Requests
 */
class PropertySearchByDistanceRequest extends ApiRequest
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
            'lat'                   => 'required|numeric',
            'lon'                   => 'required|numeric',
            'distance'              => 'nullable|integer',
            'foreclosure_status'    => 'nullable|boolean'
        ];
    }
}

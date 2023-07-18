<?php

namespace App\Http\Requests;

/**
 * Class CreateDrivingRouteRequest
 * @package App\Http\Requests
 */
class CreateDrivingRouteRequest extends ApiRequest
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
            'driving_route_temp_id'     => 'nullable|integer',
            'start_address'             => 'required|string|max:255',
            'end_address'               => 'required|string|max:255',
            'total_hours'               => 'required|numeric',
            'total_distance'            => 'required|numeric',
            'gps'                       => 'required|array',
            'gps.*.latitude'            => 'required|numeric',
            'gps.*.longitude'           => 'required|numeric',
            'route_type'                => 'nullable|in:Physical,Virtual'
        ];
    }
}

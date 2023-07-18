<?php

namespace App\Http\Requests;

/**
 * Class UpdateDrivingRouteRequest
 * @package App\Http\Requests
 */
class UpdateDrivingRouteRequest extends DefaultUpdateRequest
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
            'start_address'         => 'string|max:255',
            'end_address'           => 'string|max:255',
            'total_hours'           => 'numeric',
            'total_distance'        => 'numeric',
            'gps'                   => 'required|array',
            'gps.*.latitude'        => 'required|numeric',
            'gps.*.longitude'       => 'required|numeric'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

<?php

namespace App\Http\Requests;

/**
 * Class UpdateUserPingRequest
 * @package App\Http\Requests
 */
class UpdateUserPingRequest extends DefaultUpdateRequest
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
            'latitude'          => 'nullable|numeric',
            'longitude'         => 'nullable|numeric',
            'route'             => 'nullable|array',
            'route.*.latitude'  => 'numeric',
            'route.*.longitude' => 'numeric',
        ];
    }
}

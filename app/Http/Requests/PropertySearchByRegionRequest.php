<?php

namespace App\Http\Requests;

/**
 * Class PropertySearchByRegionRequest
 * @package App\Http\Requests
 */
class PropertySearchByRegionRequest extends ApiRequest
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
            'region'                => 'required|array|min:1',
            'region.*.lat'          => 'required|numeric',
            'region.*.lon'          => 'required|numeric',
            'foreclosure_status'    => 'nullable|boolean',
            'vacant'                => 'nullable|boolean',
            'tax_default'           => 'nullable|boolean',
            'owner_status'          => 'nullable|boolean',
            'building'              => 'nullable|array',
            'building.min'          => 'nullable|integer',
            'building.max'          => 'nullable|integer',
            'equity'                => 'nullable|array',
            'equity.min'            => 'nullable|integer',
            'equity.max'            => 'nullable|integer',
            'dwelling_type'         => 'nullable|string',
            'tired_landlord'        => 'nullable|boolean',
            'inherited'             => 'nullable|boolean',
            'unknown_equity'        => 'nullable|boolean',
            'on_market'             => 'nullable|string|max:255',
            'cash_buyer'            => 'nullable|boolean',
        ];
    }
}

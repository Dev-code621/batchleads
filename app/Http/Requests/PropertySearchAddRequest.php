<?php

namespace App\Http\Requests;

/**
 * Class PropertySearchAddRequest
 * @package App\Http\Requests
 */
class PropertySearchAddRequest extends ApiRequest
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
            'search_mode'                 => 'required|string|max:255',
            'total'                       => 'required|integer',
            'folder_id'                   => 'required|integer|exists:folders,id',
            'excluded_hashes'             => 'nullable|array',
            'excluded_hashes.*'           => 'nullable|string',
            'filter'                      => 'required|array',
            'filter.region'               => 'nullable|array',
            'filter.region.*.lat'         => 'required|numeric',
            'filter.region.*.lon'         => 'required|numeric',
            'filter.*.searchKey'          => 'nullable|string|max:255',
            'filter.*.foreclosure_status' => 'nullable|boolean',
            'filter.*.vacant'             => 'nullable|boolean',
            'filter.*.tax_default'        => 'nullable|boolean',
            'filter.*.owner_status'       => 'nullable|boolean',
            'filter.*.building'           => 'nullable|array',
            'filter.*.building.min'       => 'nullable|integer',
            'filter.*.building.max'       => 'nullable|integer',
            'filter.*.equity'             => 'nullable|array',
            'filter.*.equity.min'         => 'nullable|integer',
            'filter.*.equity.max'         => 'nullable|integer',
            'filter.*.dwelling_type'      => 'nullable|string|max:255',
            'filter.*.tired_landlord'     => 'nullable|boolean',
            'filter.*.inherited'          => 'nullable|boolean',
            'filter.*.unknown_equity'     => 'nullable|boolean',
            'filter.*.on_market'          => 'nullable|string|max:255',
            'filter.*.cash_buyer'         => 'nullable|boolean',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class PropertySearchByZipCodeRequest
 *
 * @package App\Http\Requests
 */
class PropertySearchByZipCodeRequest extends FormRequest
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
            'page'                  => 'nullable|integer',
            'pageSize'              => 'nullable|integer',
            'zip_code'              => 'required|string',
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

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['page'] = $this->route('page');
        $data['pageSize'] = $this->route('pageSize');

        return $data;
    }
}

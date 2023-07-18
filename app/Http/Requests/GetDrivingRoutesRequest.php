<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class GetDrivingRoutesRequest
 *
 * @package App\Http\Requests
 */
class GetDrivingRoutesRequest extends FormRequest
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
            'page'              => 'nullable|integer',
            'pageSize'          => 'nullable|integer',
            'orderBy'           => 'nullable|string',
            'order'             => 'nullable|in:asc,desc',
            'search'            => 'nullable|string',
            'date'              => 'nullable|string',
            'user_id'           => 'nullable|integer|exists:users,id',
            'miles'             => 'nullable|numeric',
            'is_properties'     => 'nullable|boolean',
            'route_type'        => 'nullable|in:Physical,Virtual',
            'ne_lat'            => 'nullable|numeric',
            'ne_lon'            => 'nullable|numeric',
            'sw_lat'            => 'nullable|numeric',
            'sw_lon'            => 'nullable|numeric',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['page'] = $this->route('page');

        return $data;
    }
}

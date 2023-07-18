<?php

namespace App\Http\Requests;

/**
 * Class MultiPropertyDeleteRequest
 * @package App\Http\Requests
 */
class MultiPropertyDeleteRequest extends ApiRequest
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
            'type'                      => 'string|required|in:all,multi',
            'property_ids'              => 'nullable|array|required_if:type,multi',
            'property_ids.*'            => 'integer|exists:properties,id',
            'filter'                    => 'nullable|array',
            'filter.search'             => 'nullable|string|max:255',
            'filter.folder_id'          => 'nullable|integer',
            'filter.state_id'           => 'nullable|integer',
            'filter.status'             => 'nullable|string|max:255',
            'filter.skip_traced'        => 'nullable|in:Y,N',
            'filter.owner_occupied'     => 'nullable|in:Y,N',
            'filter.user_id'            => 'nullable|integer',
            'filter.created_at'         => 'nullable|string|max:255',
            'filter.tags'               => 'nullable|array',
            'filter.tags.*'             => 'required|integer|exists:tags,id',
            'excluded_property_ids'     => 'nullable|array',
            'excluded_property_ids.*'   => 'integer|exists:properties,id',
        ];
    }
}

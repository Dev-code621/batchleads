<?php

namespace App\Http\Requests;

/**
 * Class CheckBalanceRequest
 * @package App\Http\Requests
 */
class CheckBalanceRequest extends ApiRequest
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
            'type'                      => 'string|required|in:send_mail,send_sms,purchase_phone,skip_tracing',
            'property_ids'              => 'nullable|array',
            'property_ids.*'            => 'integer|exists:properties,id',
            'filter'                    => 'nullable|array',
            'filter.search'             => 'nullable|string|max:255',
            'filter.folder_id'          => 'nullable|integer',
            'filter.driving_route_id'   => 'nullable|integer',
            'filter.status'             => 'nullable|string|max:255',
            'filter.skip_traced'        => 'nullable|in:Y,N',
            'filter.owner_occupied'     => 'nullable|in:Y,N',
            'filter.lat'                => 'nullable|numeric',
            'filter.lon'                => 'nullable|numeric',
            'filter.user_id'            => 'nullable|integer',
            'excluded_property_ids'     => 'nullable|array',
            'excluded_property_ids.*'   => 'integer|exists:properties,id',
        ];
    }
}

<?php

namespace App\Http\Requests;

/**
 * Class KpiRequest
 * @package App\Http\Requests
 */
class KpiRequest extends ApiRequest
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
            'start'             => 'required|date_format:Y-m-d',
            'end'               => 'required|date_format:Y-m-d|after_or_equal:start',
            'prev_start'        => 'nullable|date_format:Y-m-d',
            'user_id'           => 'integer|exists:users,id',
            'property_status'   => 'nullable|array',
            'property_status.*' => 'string|string|max:255'
        ];
    }
}

<?php

namespace App\Http\Requests;

/**
 * Class ZapierUnsubscribeRequest
 * @package App\Http\Requests
 */
class ZapierUnsubscribeRequest extends ApiRequest
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
            'id'      => 'required|integer|exists:zapier_subscribes,id',
        ];
    }
}

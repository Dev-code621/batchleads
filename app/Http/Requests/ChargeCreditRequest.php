<?php

namespace App\Http\Requests;

/**
 * Class ChargeCreditRequest
 * @package App\Http\Requests
 */
class ChargeCreditRequest extends ApiRequest
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
            'package_id'    => 'required|integer',
            // 'stripe_token'  => 'string|nullable',
            // 'name'          => 'string|nullable'
        ];
    }
}

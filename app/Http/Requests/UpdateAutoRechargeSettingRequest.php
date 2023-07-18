<?php

namespace App\Http\Requests;

/**
 * Class UpdateAutoRechargeSettingRequest
 * @package App\Http\Requests
 */
class UpdateAutoRechargeSettingRequest extends ApiRequest
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
            'status'            => 'required|boolean',
            'threshold'         => 'integer',
            'credit_package_id' => 'integer|exists:credit_packages,id',
        ];
    }
}

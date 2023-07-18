<?php

namespace App\Http\Requests;

/**
 * Class CreateCreditTransactionTypeRequest
 * @package App\Http\Requests
 */
class CreateCreditTransactionTypeRequest extends ApiRequest
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
            'name'              => 'required|string',
            'transaction_type'  => 'in:send_sms,send_mail,purchase_phone,skip_tracing,charge',
            'credit_amount'     => 'required|integer'
        ];
    }
}

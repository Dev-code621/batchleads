<?php

namespace App\Http\Requests;

/**
 * Class UpdateCreditTransactionTypeRequest
 * @package App\Http\Requests
 */
class UpdateCreditTransactionTypeRequest extends DefaultUpdateRequest
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
            'id'                => 'required|integer',
            'name'              => 'required|string',
            'transaction_type'  => 'in:send_sms,send_mail,purchase_phone,skip_tracing,charge',
            'credit_amount'     => 'required|integer'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

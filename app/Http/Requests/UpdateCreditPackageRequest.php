<?php

namespace App\Http\Requests;

/**
 * Class UpdateCreditPackageRequest
 * @package App\Http\Requests
 */
class UpdateCreditPackageRequest extends DefaultUpdateRequest
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
            'id'            => 'required|integer',
            'price'         => 'required|regex:/^\d*(\.\d{1,2})?$/',
            'credit_amount' => 'required|integer'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

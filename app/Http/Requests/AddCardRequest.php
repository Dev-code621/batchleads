<?php

namespace App\Http\Requests;

/**
 * Class AddCardRequest
 *
 * @package App\Http\Requests
 */
class AddCardRequest extends ApiRequest
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
            'stripe_token' => 'required|string|max:255'
        ];
    }
}

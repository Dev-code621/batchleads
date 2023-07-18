<?php

namespace App\Http\Requests;

/**
 * Class UpdateUserInfoRequest
 *
 * @package App\Http\Requests
 */
class UpdateUserInfoRequest extends ApiRequest
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
            'name'     => 'required|string|max:255',
            'phone'    => 'required|string|max:255',
            'company'  => 'string|max:255',
            'file'     => 'nullable|image|max:8000'
        ];
    }
}

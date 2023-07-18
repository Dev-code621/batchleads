<?php

namespace App\Http\Requests;

/**
 * Class ZillowDataRequest
 * @package App\Http\Requests
 */
class ZillowDataRequest extends ApiRequest
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
            'address'           => 'required|string',
            'citystatezip'      => 'required|string',
        ];
    }
}

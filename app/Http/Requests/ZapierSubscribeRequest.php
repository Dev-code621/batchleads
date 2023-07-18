<?php

namespace App\Http\Requests;

/**
 * Class ZapierSubscribeRequest
 * @package App\Http\Requests
 */
class ZapierSubscribeRequest extends ApiRequest
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
            'hookUrl'      => 'required|string|max:255',
            'type'         => 'required|string|max:255',
        ];
    }
}

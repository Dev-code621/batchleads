<?php

namespace App\Http\Requests;

/**
 * Class RemoveCardRequest
 *
 * @package App\Http\Requests
 */
class RemoveCardRequest extends ApiRequest
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
            'card_id' => 'required|string|max:255'
        ];
    }
}

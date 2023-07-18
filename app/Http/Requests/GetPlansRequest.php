<?php

namespace App\Http\Requests;

/**
 * Class GetPlansRequest
 *
 * @package App\Http\Requests
 */
class GetPlansRequest extends ApiRequest
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
            'yearly_only' => 'nullable|boolean'
        ];
    }
}

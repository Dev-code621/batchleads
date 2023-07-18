<?php

namespace App\Http\Requests;

/**
 * Class CreateTagRequest
 * @package App\Http\Requests
 */
class CreateTagRequest extends ApiRequest
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
        $rules = [
            'name'  => 'required|string|max:255',
        ];

        return $rules;
    }
}

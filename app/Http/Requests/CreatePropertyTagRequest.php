<?php

namespace App\Http\Requests;

/**
 * Class CreatePropertyTagRequest
 * @package App\Http\Requests
 */
class CreatePropertyTagRequest extends ApiRequest
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
            'property_id'  => 'required|integer|exists:properties,id',
            'tag_id'  => 'required|integer|exists:tags,id',
        ];

        return $rules;
    }
}

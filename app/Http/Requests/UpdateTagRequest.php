<?php

namespace App\Http\Requests;

/**
 * Class UpdateTagRequest
 * @package App\Http\Requests
 */
class UpdateTagRequest extends DefaultUpdateRequest
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
            'id'        => 'required|integer|exists:tags,id',
            'name'      => 'required|string|max:255',
        ];
    }
}

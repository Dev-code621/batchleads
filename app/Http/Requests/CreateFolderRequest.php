<?php

namespace App\Http\Requests;

/**
 * Class CreateFolderRequest
 * @package App\Http\Requests
 */
class CreateFolderRequest extends ApiRequest
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
            'name'    => 'required|string|max:255',
            'color'   => 'nullable|string|max:255',
            'icon'    => 'nullable|string|max:255',
        ];
    }
}

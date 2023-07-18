<?php

namespace App\Http\Requests;

/**
 * Class DataExportRequest
 * @package App\Http\Requests
 */
class DataImportRequest extends ApiRequest
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
            'file_name'     => 'required|string|max:255',
            'folder_id'     => 'required|integer|exists:folders,id',
            'address'       => 'required|string|max:255',
            'city'          => 'required|string|max:255',
            'state'         => 'required|string|max:255',
            'zip'           => 'required|string|max:255',
            'phone1'        => 'nullable|string|max:255',
            'phone2'        => 'nullable|string|max:255',
            'phone3'        => 'nullable|string|max:255',
            'email1'        => 'nullable|string|max:255',
            'email2'        => 'nullable|string|max:255',
        ];
    }
}

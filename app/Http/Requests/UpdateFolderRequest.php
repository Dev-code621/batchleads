<?php

namespace App\Http\Requests;

/**
 * Class UpdateFolderRequest
 * @package App\Http\Requests
 */
class UpdateFolderRequest extends DefaultUpdateRequest
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
            'id'        => 'required|integer',
            'name'      => 'string|max:255',
            'color'     => 'string|max:255',
            'icon'      => 'string|max:255',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

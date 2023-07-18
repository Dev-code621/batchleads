<?php
namespace App\Http\Requests;

/**
 * Class UpdateMailTemplateStyleRequest
 * @package App\Http\Requests
 */
class UpdateMailTemplateStyleRequest extends DefaultUpdateRequest
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
            'id'                        => 'required|integer',
            'name'                      => 'required|string|max:255',
            'front_content'             => 'required|string',
            'back_content'              => 'required|string',
            'front_preview_image'       => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'back_preview_image'        => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

<?php
namespace App\Http\Requests;

/**
 * Class CreateMailTemplateStyleRequest
 * @package App\Http\Requests
 */
class CreateMailTemplateStyleRequest extends ApiRequest
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
            'name'                      => 'required|string|max:255',
            'front_content'             => 'required|string',
            'back_content'              => 'required|string',
            'front_preview_image'       => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'back_preview_image'        => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ];
    }
}

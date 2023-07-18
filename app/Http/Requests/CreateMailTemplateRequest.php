<?php
namespace App\Http\Requests;

/**
 * Class CreateMailTemplateRequest
 * @package App\Http\Requests
 */
class CreateMailTemplateRequest extends ApiRequest
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
            'primary_color'             => 'required|string|max:255',
            'signature_id'              => 'required|integer|exists:mail_signatures,id',
            'mail_template_style_id'    => 'required|integer|exists:mail_template_styles,id',
            'section_a'                 => 'string',
            'section_b'                 => 'string',
            'section_c'                 => 'string',
            'is_postcard'               => 'nullable|boolean'
        ];
    }
}

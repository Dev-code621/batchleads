<?php
namespace App\Http\Requests;

/**
 * Class UpdateMailTemplateRequest
 * @package App\Http\Requests
 */
class UpdateMailTemplateRequest extends DefaultUpdateRequest
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
            'primary_color'             => 'required|string|max:255',
            'signature_id'              => 'required|integer',
            'section_a'                 => 'string',
            'section_b'                 => 'string',
            'section_c'                 => 'string',
            'mail_template_style_id'    => 'required|integer',
            'is_postcard'              => 'nullable|boolean'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

<?php
namespace App\Http\Requests;

/**
 * Class UpdateMailTemplateSectionRequest
 * @package App\Http\Requests
 */
class UpdateMailTemplateSectionRequest extends DefaultUpdateRequest
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
            'id'             => 'required|integer',
            'name'           => 'required|string|max:255',
            'content'        => 'required|string|max:255',
            'template_id'    => 'required|integer',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

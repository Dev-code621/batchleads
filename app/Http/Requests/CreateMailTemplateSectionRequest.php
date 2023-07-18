<?php
namespace App\Http\Requests;

/**
 * Class CreateMailTemplateSectionRequest
 * @package App\Http\Requests
 */
class CreateMailTemplateSectionRequest extends ApiRequest
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
            'name'          => 'required|string|max:255',
            'content'       => 'required|string|max:255',
            'template_id'   => 'required|integer',
        ];
    }
}

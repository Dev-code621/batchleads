<?php
namespace App\Http\Requests;

/**
 * Class UpdateSmsCampaignTemplateDetailRequest
 * @package App\Http\Requests
 */
class UpdateSmsCampaignTemplateDetailRequest extends DefaultUpdateRequest
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
            'id'                    => 'required|integer',
            'content'               => 'required|string|max:255',
            'day'                   => 'integer',
            'template_master_id'    => 'integer',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['id'] = $this->route('id');

        return $data;
    }
}

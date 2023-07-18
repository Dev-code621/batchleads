<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class GetSmsCampaignTemplateMastersRequest
 *
 * @package App\Http\Requests
 */
class GetSmsCampaignTemplateMastersRequest extends FormRequest
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
            'page'              => 'nullable|integer',
            'pageSize'          => 'nullable|integer',
            'orderBy'           => 'nullable|string',
            'order'             => 'nullable|in:asc,desc',
            'search'            => 'nullable|string'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['page'] = $this->route('page');

        return $data;
    }
}

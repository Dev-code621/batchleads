<?php

namespace App\Http\Requests;

/**
 * Class GetMailCampaignsRequest
 *
 * @package App\Http\Requests
 */
class GetMailCampaignsRequest extends DefaultIndexRequest
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
            'page'      => 'nullable|integer',
            'pageSize'  => 'nullable|integer',
            'orderBy'   => 'nullable|string',
            'order'     => 'nullable|in:asc,desc',
            'search'    => 'nullable|string',
            'finished'  => 'nullable|integer'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['page'] = $this->route('page');

        return $data;
    }
}

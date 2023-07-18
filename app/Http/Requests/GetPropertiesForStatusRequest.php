<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class GetPropertiesForStatusRequest
 *
 * @package App\Http\Requests
 */
class GetPropertiesForStatusRequest extends FormRequest
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
            'search'            => 'nullable|string|max:255',
            'folder_id'         => 'nullable|integer|exists:folders,id',
            'state_id'          => 'nullable|integer|exists:states,id',
            'driving_route_id'  => 'nullable|integer|exists:driving_routes,id',
            'lat'               => 'nullable|numeric',
            'lon'               => 'nullable|numeric',
            'status'            => 'nullable|array',
            'status.*'          => 'string|string|max:255',
            'skip_traced'       => 'nullable|in:Y,N',
            'user_id'           => 'nullable|integer|exists:users,id',
            'owner_occupied'    => 'nullable|in:Y,N',
            'sms_campaign_id'   => 'nullable|integer|exists:sms_campaigns,id',
            'mail_campaign_id'  => 'nullable|integer|exists:mail_campaigns,id',
            'created_at'        => 'nullable|string|max:255',
            'tags'              => 'nullable|array',
            'tags.*'            => 'required|integer|exists:tags,id'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['page'] = $this->route('page');

        return $data;
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class GetTeamMembersRequest
 *
 * @package App\Http\Requests
 */
class GetTeamMembersRequest extends FormRequest
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
            'pageSize'  => 'nullable|integer',
            'orderBy'   => 'nullable|string',
            'order'     => 'nullable|in:asc,desc',
            'search'    => 'nullable|string'
        ];
    }
}

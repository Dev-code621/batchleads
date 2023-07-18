<?php

namespace App\Http\Requests;

/**
 * Class UpdateStateRequest
 * @package App\Http\Requests
 */
class UpdateStateRequest extends DefaultUpdateRequest
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
            'id'        => 'required|integer|exists:states,id',
            'name'      => 'required|string|max:255|not_in:New,Hot,Not Interested,Currently Marketing,Dead Deal,Danger',
            'color'     => 'required|string|max:255',
            'icon'      => 'required|in:New,Hot,Not Interested,Currently Marketing,Dead Deal,Danger,star,dollar,question,car,house,road',
        ];
    }
}

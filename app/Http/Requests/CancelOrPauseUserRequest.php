<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class CancelOrPauseUserRequest
 *
 * @package App\Http\Requests
 */
class CancelOrPauseUserRequest extends FormRequest
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
            'survey_id'     => 'nullable|in:cost_much,not_using,technical_support,data_quality,customer_service,found_alternative,learn_more',
            'text'          => 'nullable|string|max:255',
        ];
    }
}

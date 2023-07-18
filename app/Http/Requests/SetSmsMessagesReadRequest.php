<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class SetSmsMessagesReadRequest
 *
 * @package App\Http\Requests
 */
class SetSmsMessagesReadRequest extends FormRequest
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
            'master_id'         => 'required|integer|exists:sms_masters,id',
            'pageSize'          => 'nullable|integer',
            'orderBy'           => 'nullable|string',
            'order'             => 'nullable|in:asc,desc',
            'search'            => 'nullable|string'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['master_id'] = $this->route('masterId');

        return $data;
    }
}

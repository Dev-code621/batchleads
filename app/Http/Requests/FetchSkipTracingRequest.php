<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class FetchSkipTracingRequest
 *
 * @package App\Http\Requests
 */
class FetchSkipTracingRequest extends FormRequest
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
            'property_id'    => 'required|integer|exists:properties,id'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['property_id'] = $this->route('propertyId');

        return $data;
    }
}

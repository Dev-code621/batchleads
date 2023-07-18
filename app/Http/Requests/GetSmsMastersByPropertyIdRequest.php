<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class GetSmsMastersByPropertyIdRequest
 *
 * @package App\Http\Requests
 */
class GetSmsMastersByPropertyIdRequest extends FormRequest
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
            'property_id'  => 'required|integer|exists:properties,id',
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['page'] = $this->route('page');

        return $data;
    }
}

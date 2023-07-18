<?php
namespace App\Http\Requests;

/**
 * Class CreateMailSignatureRequest
 * @package App\Http\Requests
 */
class CreateMailSignatureRequest extends ApiRequest
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
            'label'                 => 'required|string|max:255',
            'sign_off'              => 'required|string|max:255',
            'name'                  => 'required|string|max:255',
            'contact_phone'         => 'required|string|max:255',
            'contact_email'         => 'nullable|string|email|max:255',
            'contact_website'       => 'nullable|string|max:255',
            'address_line1'         => 'required|string|max:255',
            'address_line2'         => 'nullable|string|max:255',
            'address_city'          => 'required|string|max:255',
            'address_state'         => 'required|string|max:255',
            'address_zip'           => 'required|string|max:255',
            'disclosure_agreement'  => 'nullable|string|max:255',
        ];
    }
}

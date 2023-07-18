<?php

namespace App\Http\Requests;

/**
 * Class SubscribeRequest
 * @package App\Http\Requests
 */
class SubscribeRequest extends ApiRequest
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
            'stripe_plan'       => 'required|string|max:255',
            'stripe_token'      => 'required|string|max:255',
            'customer_name'     => 'required|string|max:255',
            'promo_code'        => 'nullable|string|max:255',
            'add_ons'           => 'nullable|array',
            'add_ons.*'         => 'required|in:street_view,driving_route'
        ];
    }
}

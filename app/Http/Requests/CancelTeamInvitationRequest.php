<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class CancelTeamInvitationRequest
 *
 * @package App\Http\Requests
 */
class CancelTeamInvitationRequest extends FormRequest
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
            'invitation_id'  => 'required|integer|exists:team_invitations,id'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['invitation_id'] = $this->route('invitationId');

        return $data;
    }
}

<?php

namespace App\Http\Resources;

//use App\Http\Resources\Collections\PaymentDetailsListCollection;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Helpers\DateHelper;

/**
 * Class UserResource
 *
 * @package App\Http\Resources
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function toArray($request)
    {
        /** @var $this User */
        return [
            'id'                            => $this->id,
            'name'                          => $this->name,
            'email'                         => $this->email,
            'phone'                         => $this->phone,
            'twilio_messaging_service_id'   => $this->twilio_messaging_service_id,
            'stripe_id'                     => $this->stripe_id,
            'card_brand'                    => $this->card_brand,
            'card_last_four'                => $this->card_last_four,
            'role'                          => $this->role,
            'photo_url'                     => $this->photo_url,
            'credit'                        => $this->credit,
            'pre_selected_plan_index'       => $this->pre_selected_plan_index,
            'team_id'                       => $this->team_id,
            'add_ons'                       => $this->add_ons,
            'user_notification_settings'    => $this->user_notification_settings,
            'first_promoter'                => $this->first_promoter,
            'created_at'                    => $this->created_at ? DateHelper::dt($this->created_at) : null,
            'updated_at'                    => $this->updated_at ? DateHelper::dt($this->updated_at) : null
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailCampaignProperty extends Model
{
    protected $fillable = ['mail_campaign_id', 'property_id', 'status', 'postcard_id'];

    public function property() {
        return $this->belongsTo('App\Models\Property');
    }

    public function mailCampaign() {
        return $this->belongsTo('App\Models\MailCampaign');
    }
}

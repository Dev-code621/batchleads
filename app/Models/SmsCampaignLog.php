<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsCampaignLog extends Model
{
    protected $fillable = ['sms_campaign_id', 'message', 'sms_id', 'sender', 'receiver', 'direction', 'status'];

    public function smsCampaign() {
        return $this->belongsTo('App\Models\SmsCampaign');
    }
}

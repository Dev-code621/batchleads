<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsCampaignProperty extends Model
{
    protected $fillable = ['sms_campaign_id', 'property_id'];

    public function property() {
        return $this->belongsTo('App\Models\Property');
    }

    public function smsCampaign() {
        return $this->belongsTo('App\Models\SmsCampaign');
    }
}

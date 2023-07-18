<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsCampaign extends Model
{
    protected $fillable = ['current_day', 'finished'];

    protected $appends = ['template_master', 'property_count'];

    public function smsCampaignProperties() {
        return $this->hasMany('App\Models\SmsCampaignProperty');
    }

    public function templateMaster() {
        return $this->belongsTo('App\Models\SmsCampaignTemplateMaster', 'sms_campaign_template_master_id');
    }

    public function smsCampaignLogs() {
        return $this->hasMany('App\Models\SmsCampaignLog');
    }

    public function getTemplateMasterAttribute() {
        return $this->templateMaster()->first();
    }

    public function getPropertyCountAttribute()
    {
        return $this->smsCampaignProperties()->count();
    }
}

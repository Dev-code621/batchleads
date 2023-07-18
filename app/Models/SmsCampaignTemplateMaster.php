<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsCampaignTemplateMaster extends Model
{
    protected $fillable = ['name'];

    protected $appends = ['template_details', 'sms_campaign_count'];

    public function getTemplateDetailsAttribute()
    {
        return $this->smsCampaignTemplateDetails()->get();
    }

    public function getSmsCampaignCountAttribute()
    {
        return $this->campaign()->count();
    }

    public function smsCampaignTemplateDetails() {
        return $this->hasMany('App\Models\SmsCampaignTemplateDetail', 'template_master_id');
    }

    public function campaign() {
        return $this->hasMany('App\Models\SmsCampaign');
    }
}

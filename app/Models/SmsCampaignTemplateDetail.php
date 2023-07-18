<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsCampaignTemplateDetail extends Model
{
    protected $fillable = ['content', 'day'];

    public function smsCampaignTemplateMaster()
    {
        return $this->belongsTo('App\Models\SmsCampaignTemplateMaster', 'template_master_id');
    }
}

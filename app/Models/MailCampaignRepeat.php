<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailCampaignRepeat extends Model
{
    protected $fillable = ['finished', 'current_repeat'];

    protected $appends = ['mail_campaign'];

    public function mailCampaign()
    {
        return $this->belongsTo('App\Models\MailCampaign');
    }

    public function getMailCampaignAttribute()
    {
        return $this->mailCampaign()->first();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailCampaign extends Model
{
    protected $fillable = ['user_id', 'template_id', 'finished'];

    protected $appends = ['mail_template', 'property_count', 'repeat_every', 'total_mailers'];

    public function getMailTemplateAttribute() {
        return $this->mailTemplate()->first();
    }

    public function mailCampaignProperties() {
        return $this->hasMany('App\Models\MailCampaignProperty');
    }

    public function mailTemplate() {
        return $this->belongsTo('App\Models\MailTemplate', 'template_id');
    }

    public function getPropertyCountAttribute()
    {
        return $this->mailCampaignProperties()->count();
    }

    public function mailCampaignRepeat() {
        return $this->hasOne('App\Models\MailCampaignRepeat');
    }

    public function getRepeatEveryAttribute() {
        $data = $this->mailCampaignRepeat()->first();
        if ($data) {
            return $data['repeat_every'];
        }

        return null;
    }

    public function getTotalMailersAttribute() {
        $data = $this->mailCampaignRepeat()->first();
        if ($data) {
            return $data['total_mailers'];
        }

        return null;
    }
}

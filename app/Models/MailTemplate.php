<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailTemplate extends Model
{
    protected $fillable = [
        'name',
        'primary_color',
        'signature_id',
        'mail_template_style_id',
        'is_postcard'
    ];

    protected $appends = ['mail_signature', 'mail_template_style', 'mail_template_sections', 'mail_campaign_count'];

    public function getMailSignatureAttribute() {
        return $this->mailSignature()->first();
    }

    public function getMailTemplateStyleAttribute() {
        return $this->mailTemplateStyle()->first();
    }

    public function getMailTemplateSectionsAttribute() {
        return $this->mailTemplateSections()->get();
    }

    public function getMailCampaignCountAttribute() {
        return $this->mailCampaigns()->count();
    }

    public function mailSignature()
    {
        return $this->belongsTo('App\Models\MailSignature', 'signature_id');
    }

    public function mailTemplateSections()
    {
        return $this->hasMany('App\Models\MailTemplateSection', 'template_id');
    }

    public function mailTemplateStyle()
    {
        return $this->belongsTo('App\Models\MailTemplateStyle', 'mail_template_style_id');
    }

    public function mailCampaigns()
    {
        return $this->hasMany('App\Models\MailCampaign', 'template_id');
    }
}

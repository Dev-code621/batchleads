<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailTemplateStyle extends Model
{
    protected $fillable = [
        'name',
        'front_content',
        'back_content',
        'front_preview_image_url',
        'back_preview_image_url',
        'primary_color'
    ];

    protected $appends = ['mail_template_style_sections'];

    public function mailTemplates()
    {
        return $this->hasMany('App\Models\MailTemplate');
    }

    public function mailTemplateStyleSections()
    {
        return $this->hasMany('App\Models\MailTemplateStyleSection');
    }

    public function getMailTemplateStyleSectionsAttribute()
    {
        return $this->mailTemplateStyleSections()->get();
    }
}

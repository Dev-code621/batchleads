<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailSignature extends Model
{
    protected $fillable = [
        'label',
        'sign_off',
        'name',
        'contact_phone',
        'contact_email',
        'contact_website',
        'address_line1',
        'address_line2',
        'address_city',
        'address_state',
        'address_zip',
        'disclosure_agreement'
    ];

    protected $appends = ['mail_template_count'];

    public function getMailTemplateCountAttribute()
    {
        return $this->mailTemplates()->count();
    }

    public function mailTemplates()
    {
        return $this->hasMany('App\Models\MailTemplate', 'signature_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailTemplateStyleSection extends Model
{
    protected $fillable = [
        'name',
        'content'
    ];

    public function mailTemplateStyle()
    {
        return $this->belongsTo('App\Models\MailTemplateStyle');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailTemplateSection extends Model
{
    protected $fillable = [
        'name',
        'content'
    ];

    public function mailTemplate()
    {
        return $this->belongsTo('App\Models\MailTemplate', 'template_id');
    }
}

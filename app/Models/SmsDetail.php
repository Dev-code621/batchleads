<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsDetail extends Model
{
    protected $fillable = ['is_unread'];

    protected function smsMaster()
    {
        return $this->belongsTo('App\Model\SmsMaster');
    }
}

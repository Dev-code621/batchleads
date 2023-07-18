<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsMaster extends Model
{
    protected $fillable = ['latest_message', 'badge_number'];

    protected function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function smsDetails()
    {
        return $this->hasMany('App\Models\SmsDetail');
    }
}

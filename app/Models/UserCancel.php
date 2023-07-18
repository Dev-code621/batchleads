<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCancel extends Model
{
    protected $fillable = ['cancel_at', 'active'];

    protected $appends = ['user'];

    public function getUserAttribute()
    {
        return $this->user()->first();
    }

    public function user() {
        return $this->belongsTo('App\Models\User');
    }
}

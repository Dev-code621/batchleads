<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFp extends Model
{
    protected $fillable = ['tracking_ref_id'];

    public function user() {
        return $this->belongsTo('App\Models\User');
    }
}

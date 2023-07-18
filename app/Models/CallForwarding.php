<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CallForwarding extends Model
{
    protected $fillable = ['phone_number'];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserNotificationSetting extends Model
{
    protected $fillable = ['enabled'];

    protected $hidden = [
        'created_at',
        'updated_at',
        'user_id',
        'id',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['name'];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}

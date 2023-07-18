<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SkipTracing extends Model
{
    protected $fillable = ['email', 'phone_number', 'property_id'];
}

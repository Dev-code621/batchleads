<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPing extends Model
{
  protected $fillable = ['latitude', 'longitude', 'route', 'is_tracking'];
}

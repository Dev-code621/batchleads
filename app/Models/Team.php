<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
  protected $fillable = ['skip_tracing_count', 'property_export_count'];

  public function owner() {
    return $this->belongsTo('App\Models\User', 'owner_user_id');
  }

  public function teamUsers() {
    return $this->hasMany('App\Models\TeamUser');
  }
}

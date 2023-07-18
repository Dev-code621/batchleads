<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamInvitation extends Model
{
  protected $fillable = [];

  public function inviteUser() {
    return $this->belongsTo('App\Models\User', 'user_id');
  }

  public function team() {
    return $this->belongsTo('App\Models\Team');
  }
}

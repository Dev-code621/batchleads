<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamUser extends Model
{
    protected $fillable = ['team_id', 'user_id', 'is_active'];

    protected $appends = ['team'];

    public function getTeamAttribute() {
        return $this->team()->first();
    }

    public function team() {
        return $this->belongsTo('App\Models\Team');
    }

    public function user() {
        return $this->belongsTo('App\Models\User');
    }
}

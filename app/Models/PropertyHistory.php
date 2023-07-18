<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyHistory extends Model
{
    protected $fillable = ['description'];

    protected $appends = ['property', 'user'];

    public function getPropertyAttribute() {
        return $this->property()->first();
    }

    public function getUserAttribute() {
        return $this->user()->first();
    }

    public function property() {
        return $this->belongsTo('App\Models\Property');
    }

    public function user() {
        return $this->belongsTo('App\Models\User');
    }
}

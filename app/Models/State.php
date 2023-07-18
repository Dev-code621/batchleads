<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    protected $fillable = ['icon', 'name', 'color'];

    protected $appends = ['property_count'];

    public function getPropertyCountAttribute()
    {
        return $this->properties()->count();
    }

    public function properties()
    {
        return $this->hasMany('App\Models\Property');
    }
}

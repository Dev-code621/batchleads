<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DrivingRoute extends Model
{
    protected $fillable = ['user_id', 'start_address', 'end_address', 'date_time', 'total_hours', 'total_distance', 'gps', 'route_type'];

    protected $appends = ['property_count'];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function properties()
    {
        return $this->hasMany('App\Models\Property');
    }

    public function getPropertyCountAttribute()
    {
        return $this->properties()->count();
    }
}

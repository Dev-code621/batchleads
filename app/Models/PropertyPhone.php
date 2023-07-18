<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyPhone extends Model
{
    protected $fillable = ['phone_number', 'property_id', 'type'];

    public function property() {
        return $this->belongsTo('App\Models\Property');
    }
}

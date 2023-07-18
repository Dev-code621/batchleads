<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyEmail extends Model
{
    protected $fillable = ['email', 'property_id', 'type'];

    public function property() {
        return $this->belongsTo('App\Models\Property');
    }
}

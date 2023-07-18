<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyImage extends Model
{
    protected $fillable = ['url'];

    public function property() {
        return $this->belongsTo('App\Models\Property');
    }
}

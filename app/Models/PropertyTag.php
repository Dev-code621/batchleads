<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyTag extends Model
{
    protected $fillable = [];

    protected $appends = ['tag_name'];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function getTagNameAttribute() {
        return $this->tag()->first()['name'];
    }

    public function tag() {
        return $this->belongsTo('App\Models\Tag');
    }
}

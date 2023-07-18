<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
  protected $fillable = ['name', 'color', 'icon'];

  protected $appends = ['property_count'];

  public function properties() {
    return $this->hasMany('App\Models\Property');
  }

  protected function getPropertyCountAttribute()
  {
    return $this->properties()->count();
  }
}

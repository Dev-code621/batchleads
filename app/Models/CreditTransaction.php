<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditTransaction extends Model
{
    protected $fillable = [];

    protected $appends = ['reference_user'];

    public function getReferenceUserAttribute() {
        return $this->referenceUser()->first();
    }

    public function referenceUser() {
        return $this->belongsTo('App\Models\User', 'reference_user_id');
    }
}

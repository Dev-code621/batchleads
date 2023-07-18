<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AutoRechargeSetting extends Model
{
    protected $fillable = ['status', 'threshold', 'credit_package_id'];

    protected $appends = ['credit_package'];

    public function getCreditPackageAttribute()
    {
        return $this->creditPackage()->first();
    }

    public function creditPackage()
    {
        return $this->belongsTo('App\Models\CreditPackage');
    }
}

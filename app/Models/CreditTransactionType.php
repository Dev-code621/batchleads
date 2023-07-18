<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditTransactionType extends Model
{
  protected $fillable = ['name', 'credit_amount'];
}

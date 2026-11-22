<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $fillable = ['name', 'iso2', 'phone_code', 'is_active'];

    public function institutions()
    {
        return $this->hasMany(Institution::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    protected $fillable = [
        'country_id', 'institution_type_id', 'name', 
        'slug', 'acronym', 'website', 'logo_url', 'is_active'
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function type()
    {
        return $this->belongsTo(InstitutionType::class, 'institution_type_id');
    }

    public function faculties()
    {
        return $this->hasMany(Faculty::class);
    }
}

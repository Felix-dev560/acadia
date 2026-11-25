<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'country_id',
        'institution_id',
        'faculty_id',
        'department_id',
        'academic_level_id',
        'bio',
        'phone',
        'avatar_url',
        'avatar_public_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function academicLevel()
    {
        return $this->belongsTo(AcademicLevel::class);
    }
}
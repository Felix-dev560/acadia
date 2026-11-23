<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id', 'country_id', 'institution_id', 'faculty_id', 
        'department_id', 'academic_level_id', 'bio', 'phone', 
        'avatar_url', 'avatar_public_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

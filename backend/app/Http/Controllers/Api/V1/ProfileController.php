<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'country_id'         => 'nullable|exists:countries,id',
            'institution_id'     => 'nullable|exists:institutions,id',
            'faculty_id'         => 'nullable|exists:faculties,id',
            'department_id'      => 'nullable|exists:departments,id',
            'academic_level_id'  => 'nullable|exists:academic_levels,id',
            'bio'                => 'nullable|string|max:1000',
            'phone'              => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        $profile = $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        $profile->load(['country', 'institution', 'faculty', 'department', 'academicLevel']);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data'    => ['profile' => $profile]
        ]);
    }
}
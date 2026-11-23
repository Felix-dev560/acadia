<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\Institution;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\AcademicLevel;

class InstitutionController extends Controller
{
    public function countries()
    {
        return response()->json([
            'success' => true,
            'data' => Country::where('is_active', true)->get()
        ]);
    }

    public function institutions()
    {
        return response()->json([
            'success' => true,
            'data' => Institution::with(['country', 'type'])->where('is_active', true)->get()
        ]);
    }

    public function faculties($institutionId)
    {
        return response()->json([
            'success' => true,
            'data' => Faculty::where('institution_id', $institutionId)->where('is_active', true)->get()
        ]);
    }

    public function departments($facultyId)
    {
        return response()->json([
            'success' => true,
            'data' => Department::where('faculty_id', $facultyId)->where('is_active', true)->get()
        ]);
    }

    public function academicLevels()
    {
        return response()->json([
            'success' => true,
            'data' => AcademicLevel::orderBy('sort_order')->get()
        ]);
    }
}

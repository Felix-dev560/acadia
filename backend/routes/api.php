<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\InstitutionController;
use App\Http\Controllers\Api\V1\ProfileController;

Route::prefix('v1')->group(function () {
    // Public Academic Hierarchy Routes
    Route::get('/countries', [InstitutionController::class, 'countries']);
    Route::get('/institutions', [InstitutionController::class, 'institutions']);
    Route::get('/institutions/{id}/faculties', [InstitutionController::class, 'faculties']);
    Route::get('/faculties/{id}/departments', [InstitutionController::class, 'departments']);
    Route::get('/academic-levels', [InstitutionController::class, 'academicLevels']);

    // Auth
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        
        // Profile
        Route::put('/profile', [ProfileController::class, 'update']);
    });
});
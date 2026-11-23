<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

Route::prefix('v1')->group(function () {
    // Public Academic Hierarchy Routes
    Route::get('/countries', [\App\Http\Controllers\Api\V1\InstitutionController::class, 'countries']);
    Route::get('/institutions', [\App\Http\Controllers\Api\V1\InstitutionController::class, 'institutions']);
    Route::get('/institutions/{id}/faculties', [\App\Http\Controllers\Api\V1\InstitutionController::class, 'faculties']);
    Route::get('/faculties/{id}/departments', [\App\Http\Controllers\Api\V1\InstitutionController::class, 'departments']);
    Route::get('/academic-levels', [\App\Http\Controllers\Api\V1\InstitutionController::class, 'academicLevels']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
    });
});

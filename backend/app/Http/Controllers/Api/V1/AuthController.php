<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'public_id' => Str::uuid(),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status' => 'active',
        ]);

        Auth::login($user);

        // Load nested profile data
        $user->load([
            'profile.country', 
            'profile.institution', 
            'profile.faculty', 
            'profile.department', 
            'profile.academicLevel'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data' => ['user' => $user]
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $request->session()->regenerate();

        // Load nested profile data
        $user = Auth::user()->load([
            'profile.country', 
            'profile.institution', 
            'profile.faculty', 
            'profile.department', 
            'profile.academicLevel'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => ['user' => $user]
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        // Load nested profile data
        $user = $request->user()->load([
            'profile.country', 
            'profile.institution', 
            'profile.faculty', 
            'profile.department', 
            'profile.academicLevel'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User retrieved',
            'data' => ['user' => $user]
        ]);
    }
}

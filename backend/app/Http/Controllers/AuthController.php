<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;

use App\Models\User;
use App\Mail\VerificationEmail;
use App\Mail\OtpEmail;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
{
    try {
        // Validate request
        $request->validate([
            'name'     => 'required',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        // Create user
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'status'   => 0 // unverified
        ]);

        // Generate verification token
        $verificationToken = Str::random(60);
        $user->update([
            'otp' => $verificationToken // reusing otp field
        ]);

        // Generate verification URL
        $verificationUrl = URL::to('/api/verify-email?token=' . $verificationToken);

        // Send verification email
        Mail::to($user->email)->send(
            new VerificationEmail($user, $verificationUrl)
        );

        return response()->json([
            'status'  => true,
            'message' => 'User registered successfully. Please check your email to verify your account.',
            'data'    => $user,
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'status'  => false,
            'message' => 'Validation failed',
            'errors'  => $e->errors()
        ], 422);

    } catch (\Exception $e) {

        return response()->json([
            'status'  => false,
            'message' => 'Something went wrong',
            'error'   => $e->getMessage()
        ], 500);
    }
}
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'token' => 'required'
        ]);

        $user = User::where('otp', $request->token)->first();  //tokcen match aagura user get

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid verification token'
            ], 400);
        }

        $user->update([
            'status' => 1,
            'otp' => null // clear the token
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Email verified successfully'
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid login details'
            ], 401);
        }

        if ($user->status != 1) {
            return response()->json([
                'status' => false,
                'message' => 'Please verify your email first'
            ], 401);
        }

        // Generate OTP
        $otp = rand(100000, 999999);
        $user->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(10) //opt valid time
        ]);

        // Send OTP email
        Mail::to($user->email)->send(new OtpEmail($user, $otp));

        return response()->json([
            'status' => true,
            'message' => 'OTP sent to your email. Please enter the OTP to complete login.'
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6'
        ]);

        $user = User::where('email', $request->email)->where('otp', $request->otp)->first();

        if (!$user || $user->otp_expires_at < now()) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid or expired OTP'
            ], 401);
        }

        // Clear OTP
        $user->update([
            'otp' => null,
            'otp_expires_at' => null
        ]);

        // Generate JWT token
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'token' => $token
        ]);
    }
}

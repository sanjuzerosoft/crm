<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LeadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;


use Illuminate\Support\Facades\Mail;

Route::get('/test-mail', function () {
    Mail::raw('Gmail SMTP is working 🎉', function ($message) {
        $message->to('thanakarthik.zerosoft@gmail.com')
            ->subject('ZST CRM Mail Test');
    });

    return 'Mail sent successfully!';
});

Route::get('/db-test', function () {
    return DB::select('SELECT * FROM leads');
});

Route::post('/test', function () {
    return 'CSRF OFF';
});


//  function () {    return 'CSRF OFF';});

Route::get(
    '/users',
    [UserController::class, 'index']
);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);

Route::get('/customers', [CustomerController::class, 'index']);
Route::get('/customers/{id}', [CustomerController::class, 'show']);

Route::post('/customers', [CustomerController::class, 'store']);

Route::put('/customers/{id}', [CustomerController::class, 'update']);

Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);

Route::middleware(['jwt.auth'])->group(function () { //jwt.aut is use to JWT

    Route::get('/leads', [LeadController::class, 'index']);
    Route::get('/leads/{id}', [LeadController::class, 'show']);

    Route::post('/leads', [LeadController::class, 'store']);

    Route::put('/leads/{id}', [LeadController::class, 'update']);

    Route::delete('/leads/{id}', [LeadController::class, 'destroy']);

});


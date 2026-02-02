<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LeadController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeadAssigneeController;
use App\Http\Controllers\IndustryTypeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ActivityDataController;


use Illuminate\Support\Facades\Mail;

Route::get('/db-test', function () {
    return DB::select('SHOW TABLES');
});

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

// login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);

// Dashboard
Route::get('/dashboard-report', [DashboardController::class, 'dashboardReport']);

// master
// lead assignee
Route::get('/lead-assignees', [LeadAssigneeController::class, 'index']);
Route::get('/lead-assignees/{id}', [LeadAssigneeController::class, 'show']);
Route::post('/lead-assignees', [LeadAssigneeController::class, 'store']);
Route::put('/lead-assignees/{id}', [LeadAssigneeController::class, 'update']);
Route::delete('/lead-assignees/{id}', [LeadAssigneeController::class, 'destroy']);
// industry type
Route::get('/industry-types', [IndustryTypeController::class, 'index']);
Route::post('/industry-types', [IndustryTypeController::class, 'store']);
Route::get('/industry-types/{id}', [IndustryTypeController::class, 'show']);
Route::put('/industry-types/{id}', [IndustryTypeController::class, 'update']);
Route::delete('/industry-types/{id}', [IndustryTypeController::class, 'destroy']);
// project
Route::get('/projects', [ProjectController::class, 'index']);
Route::post('/projects', [ProjectController::class, 'store']);
Route::get('/projects/{id}', [ProjectController::class, 'show']);
Route::put('/projects/{id}', [ProjectController::class, 'update']);
Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

// activity
Route::get('/activities', [ActivityDataController::class, 'index']);
Route::post('/activities', [ActivityDataController::class, 'store']);
Route::get('/activities/{id}', [ActivityDataController::class, 'show']);
Route::put('/activities/{id}', [ActivityDataController::class, 'update']);
Route::delete('/activities/{id}', [ActivityDataController::class, 'destroy']);
Route::middleware(['jwt.auth'])->group(function () { //jwt.aut is use to JWT

    Route::get('/leads', [LeadController::class, 'index']);
    Route::get('/leads/{id}', [LeadController::class, 'show']);

    Route::post('/leads', [LeadController::class, 'store']);

    Route::put('/leads/{id}', [LeadController::class, 'update']);

    Route::delete('/leads/{id}', [LeadController::class, 'destroy']);

    // customer
    Route::get('/customers', [CustomerController::class, 'index']);
    
    Route::get('/customers/{id}', [CustomerController::class, 'show']);

    Route::post('/customers', [CustomerController::class, 'store']);

    Route::put('/customers/{id}', [CustomerController::class, 'update']);

    Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);

});


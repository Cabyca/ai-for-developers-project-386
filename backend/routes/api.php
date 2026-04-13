<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventTypeController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\SlotController;

/*
|--------------------------------------------------------------------------
| API Routes (Laravel 11 - префикс /api добавляется автоматически)
|--------------------------------------------------------------------------
*/

// Public API
Route::get('/event-types', [EventTypeController::class, 'index']);
Route::get('/slots', [SlotController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);

// Admin API
Route::prefix('admin')->group(function () {
    Route::get('/bookings', [BookingController::class, 'adminIndex']);
    Route::post('/event-types', [EventTypeController::class, 'store']);
});

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

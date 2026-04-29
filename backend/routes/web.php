<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (Без префикса /api - для SPA)
|--------------------------------------------------------------------------
*/

// SPA Fallback -すべてのмаршрутов без /api prefix
Route::get('/{any}', function () {
    return response()->file(public_path('dist/index.html'));
})->where('any', '.*');

// Для корневого маршрута /
Route::get('/', function () {
    return response()->file(public_path('dist/index.html'));
});
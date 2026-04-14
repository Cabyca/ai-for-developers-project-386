<?php

require __DIR__ . '/../vendor/autoload.php';

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

// Initialize Laravel application
$app = require_once __DIR__ . '/../app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Request::capture();
$response = $kernel->handle($request);
$response->send();

$kernel->terminate($request, $response);

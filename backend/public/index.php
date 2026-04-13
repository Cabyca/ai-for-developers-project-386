<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

// Определение времени начала загрузки
define('LARAVEL_START', microtime(true));

// Проверка, что приложение запущено из веб-сервера
if (PHP_SAPI === 'cli') {
    exit('This script must be run from a web server.');
}

// Автозагрузка
require __DIR__.'/../vendor/autoload.php';

// Создание приложения
$app = require_once __DIR__.'/../bootstrap/app.php';

// Обработка входящего запроса
$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);

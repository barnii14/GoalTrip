<?php
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = getenv('CORS_ALLOW_ORIGINS') ?: 'http://localhost:5173,http://127.0.0.1:5173';
$allowedOrigins = array_filter(array_map('trim', explode(',', $allowedOrigins)));
$corsOrigin = in_array($requestOrigin, $allowedOrigins, true)
    ? $requestOrigin
    : (($allowedOrigins[0] ?? 'http://localhost:5173'));

header("Access-Control-Allow-Origin: " . $corsOrigin);
header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Referrer-Policy: no-referrer");

set_exception_handler(function (\Throwable $e) {
    $requestId = bin2hex(random_bytes(8));
    $logLine = sprintf(
        "[%s] %s %s | %s in %s:%d\n%s\n\n",
        date('Y-m-d H:i:s'),
        $_SERVER['REQUEST_METHOD'] ?? 'CLI',
        $_SERVER['REQUEST_URI'] ?? '',
        $e->getMessage(),
        $e->getFile(),
        $e->getLine(),
        $e->getTraceAsString()
    );
    error_log("[request_id: {$requestId}] " . $logLine);

    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'request_id' => $requestId
    ], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit();
});

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once __DIR__ . '/vendor/autoload.php';

use Controllers\HomeController;
use Controllers\AdminController;
use Core\Router;

$router = new Router();

$router->add('/', 'HomeController', 'home', 'GET');
$router->add('/home', 'HomeController', 'home', 'GET');

// Auth végpontok
$router->add('/api/auth/register', 'AuthController', 'register', 'POST');
$router->add('/api/auth/login', 'AuthController', 'login', 'POST');
$router->add('/api/auth/me', 'AuthController', 'me', 'GET');

// Termék végpontok
$router->add('/api/products', 'ProductController', 'index', 'GET');
$router->add('/api/products/leagues', 'ProductController', 'getLeagues', 'GET');
$router->add('/api/products/teams', 'ProductController', 'getTeams', 'GET');

// Rendelés végpontok
$router->add('/api/orders', 'OrderController', 'store', 'POST');
$router->add('/api/orders', 'OrderController', 'index', 'GET');

// Hírlevél végpont
$router->add('/api/subscribe', 'NewsletterController', 'subscribe', 'POST');

// Admin végpontok
$router->add('/api/admin/stats', 'AdminController', 'getStats', 'GET');
$router->add('/api/admin/users', 'AdminController', 'getAllUsers', 'GET');
$router->add('/api/admin/users/{id}/role', 'AdminController', 'updateUserRole', 'PUT');
$router->add('/api/admin/users/{id}', 'AdminController', 'deleteUser', 'DELETE');
$router->add('/api/admin/orders', 'AdminController', 'getAllOrders', 'GET');
$router->add('/api/admin/orders/{id}/status', 'AdminController', 'updateOrderStatus', 'PUT');
$router->add('/api/admin/products', 'AdminController', 'getAllProducts', 'GET');
$router->add('/api/admin/products/{id}/availability', 'AdminController', 'toggleProductAvailability', 'PUT');
$router->add('/api/admin/products/{id}/price', 'AdminController', 'updateProductPrice', 'PUT');
$router->add('/api/admin/sales-report', 'AdminController', 'getSalesReport', 'GET');

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

$base = '/backend';
if (strpos($requestUri, $base) === 0) {
    $requestUri = substr($requestUri, strlen($base));
}

$router->dispatch($requestUri, $requestMethod);
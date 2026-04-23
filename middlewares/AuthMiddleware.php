<?php
namespace Middlewares;

use Config\JwtHandler;
use Utils\Response;

class AuthMiddleware
{
    public static function authenticate()
    {
        $userData = self::tryAuthenticate();
        if (!$userData) {
            Response::error('Nincs vagy érvénytelen Authorization header', 401);
        }
        return $userData;
    }

    public static function tryAuthenticate()
    {
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $auth = $headers['Authorization']
            ?? $headers['authorization']
            ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? null)
            ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null);

        if (!$auth) {
            return null;
        }

        if (!preg_match('/^Bearer\s+(.+)$/i', trim($auth), $matches)) {
            return null;
        }

        $token = trim($matches[1]);
        if ($token === '') {
            return null;
        }

        $jwt = new JwtHandler();
        return $jwt->validateToken($token) ?: null;
    }
}
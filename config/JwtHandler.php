<?php
namespace Config;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use RuntimeException;

class JwtHandler
{
    protected $jwt_secret;
    protected $issuedAt;
    protected $expire;

    public function __construct()
    {
        if (file_exists(__DIR__ . '/../.env')) {
            $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
            $dotenv->load();
        }

        $this->jwt_secret = $_ENV['JWT_SECRET'] ?? getenv('JWT_SECRET') ?? '';
        if (!is_string($this->jwt_secret) || strlen($this->jwt_secret) < 32) {
            throw new RuntimeException('JWT_SECRET must be set and at least 32 characters long');
        }

        $this->issuedAt = time();
        $this->expire = $this->issuedAt + 3600;
    }

    public function generateToken($user_id, $email, $role = 'user')
    {
        $payload = [
            'iat' => $this->issuedAt,
            'exp' => $this->expire,
            'user_id' => $user_id,
            'email' => $email,
            'role' => $role
        ];
        return JWT::encode($payload, $this->jwt_secret, 'HS256');
    }

    public function validateToken($token)
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwt_secret, 'HS256'));
            return (array) $decoded;
        } catch (Exception $e) {
            return false;
        }
    }
}
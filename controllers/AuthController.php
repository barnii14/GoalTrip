<?php
namespace Controllers;

use Config\Database;
use Config\JwtHandler;
use Middlewares\AuthMiddleware;
use Repositories\UserRepository;
use Utils\Response;

class AuthController
{
    private $userRepo;
    private $jwt;

    public function __construct()
    {
        $db = new Database();
        $conn = $db->getConnection();
        $this->userRepo = new UserRepository($conn);
        $this->jwt = new JwtHandler();
    }

    public function register()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['name'], $data['email'], $data['password'])) {
            Response::error('Hiányzó mezők', 400);
        }

        $email = trim((string) $data['email']);
        $password = (string) $data['password'];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Érvénytelen email cím', 400);
        }

        if (strlen($password) < 8) {
            Response::error('A jelszónak legalább 8 karakterből kell állnia', 400);
        }

        $existing = $this->userRepo->findByEmail($email);
        if ($existing) {
            Response::error('Email már regisztrálva van', 409);
        }

        $userData = [
            'nev' => $data['name'],
            'email' => $email,
            'jelszo' => $password,
            'telefonszam' => $data['phone'] ?? null,
            'cim' => $data['address'] ?? null
        ];

        if ($this->userRepo->create($userData)) {
            Response::success('Sikeres regisztráció', null, 201);
        } else {
            Response::error('Sikertelen regisztráció', 500);
        }
    }

    public function login()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['email'], $data['password'])) {
            Response::error('Hiányzó email vagy jelszó', 400);
        }

        $user = $this->userRepo->findByEmail($data['email']);
        if (!$user) {
            Response::error('Hibás email vagy jelszó', 401);
        }

        $passwordMatches = false;
        if (password_verify($data['password'], $user['jelszo'])) {
            $passwordMatches = true;
        } elseif ($user['jelszo'] === $data['password']) {
            $passwordMatches = true;
            $this->userRepo->updatePassword($user['felhasznalo_id'], password_hash($data['password'], PASSWORD_DEFAULT));
        }

        if (!$passwordMatches) {
            Response::error('Hibás email vagy jelszó', 401);
        }

        $isAdmin = (bool) ($user['isAdmin'] ?? false) || ((int) ($user['jogosultsag_id'] ?? 0) === 1);
        $token = $this->jwt->generateToken($user['felhasznalo_id'], $user['email']);
        Response::success('Sikeres bejelentkezés', [
            'token' => $token,
            'user' => [
                'id' => $user['felhasznalo_id'],
                'name' => $user['nev'],
                'email' => $user['email'],
                'phone' => $user['telefonszam'] ?? null,
                'address' => $user['cim'] ?? null,
                'isAdmin' => $isAdmin
            ]
        ]);
    }

    public function me()
    {
        $userData = AuthMiddleware::authenticate();
        $user = $this->userRepo->findById($userData['user_id']);

        if (!$user) {
            Response::error('Felhasználó nem található', 404);
        }

        $isAdmin = (bool) ($user['isAdmin'] ?? false) || ((int) ($user['jogosultsag_id'] ?? 0) === 1);
        Response::success('Profil betöltve', [
            'user' => [
                'id' => $user['felhasznalo_id'],
                'name' => $user['nev'],
                'email' => $user['email'],
                'phone' => $user['telefonszam'] ?? null,
                'address' => $user['cim'] ?? null,
                'isAdmin' => $isAdmin
            ]
        ]);
    }
}
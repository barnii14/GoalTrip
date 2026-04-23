<?php
namespace Models;

use PDO;

class User
{
    private $conn;
    private $table = 'felhasznalok';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function findByEmail($email)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute(['email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findById($id)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE felhasznalo_id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updatePassword($userId, $hashedPassword)
    {
        $query = "UPDATE " . $this->table . " SET jelszo = :jelszo WHERE felhasznalo_id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            ':jelszo' => $hashedPassword,
            ':id' => $userId,
        ]);
    }

    public function create($data)
    {
        $query = "INSERT INTO " . $this->table . "
                  (nev, email, jelszo, telefonszam, cim, isAdmin)
                  VALUES (:nev, :email, :jelszo, :telefon, :cim, 0)";
        $stmt = $this->conn->prepare($query);
        $hashed = password_hash($data['jelszo'], PASSWORD_DEFAULT);
        return $stmt->execute([
            ':nev' => $data['nev'],
            ':email' => $data['email'],
            ':jelszo' => $hashed,
            ':telefon' => $data['telefonszam'] ?? null,
            ':cim' => $data['cim'] ?? null
        ]);
    }

    public function getAllUsers()
    {
        $query = "SELECT * FROM " . $this->table . " ORDER BY regisztracio_datuma DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateRole($userId, $isAdmin)
    {
        $query = "UPDATE " . $this->table . " SET isAdmin = :isAdmin WHERE felhasznalo_id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            ':isAdmin' => $isAdmin ? 1 : 0,
            ':id' => $userId
        ]);
    }

    public function delete($userId)
    {
        $query = "DELETE FROM " . $this->table . " WHERE felhasznalo_id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':id' => $userId]);
    }
}
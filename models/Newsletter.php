<?php
namespace Models;

use PDO;

class Newsletter
{
    private $conn;
    private $table = 'hirlevel';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function exists($email)
    {
        $query = "SELECT id FROM " . $this->table . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':email' => $email]);
        return $stmt->rowCount() > 0;
    }

    public function subscribe($email)
    {
        $query = "INSERT INTO " . $this->table . " (email, created_at) VALUES (:email, NOW())";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':email' => $email]);
    }
}
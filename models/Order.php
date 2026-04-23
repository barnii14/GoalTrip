<?php
namespace Models;

use PDO;

class Order
{
    private $conn;
    private $table = 'rendelesek';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create($userId, $total, $status = 'CREATED')
    {
        $query = "INSERT INTO " . $this->table . " (felhasznalo_id, osszeg, allapot, datum)
                  VALUES (:uid, :total, :status, NOW())";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            ':uid' => $userId,
            ':total' => $total,
            ':status' => $status
        ]);
        return $this->conn->lastInsertId();
    }

    public function findByUser($userId)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE felhasznalo_id = :uid ORDER BY datum DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':uid' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
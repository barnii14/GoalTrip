<?php
namespace Models;

use PDO;

class Product
{
    private $conn;
    private $table = 'termekek';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll($filters = [])
    {
        $sql = "SELECT t.*, k.nev as kategoria_nev
                FROM " . $this->table . " t
                LEFT JOIN kategoria k ON t.kategoria_id = k.kategoria_id
                WHERE 1=1";
        $params = [];

        if (!empty($filters['category'])) {
            $sql .= " AND k.nev LIKE :category";
            $params[':category'] = '%' . $filters['category'] . '%';
        }
        if (!empty($filters['search'])) {
            $sql .= " AND (t.csapatnev LIKE :search OR t.leiras LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function findById($id)
    {
        $sql = "SELECT t.*, k.nev as kategoria_nev
                FROM termekek t
                LEFT JOIN kategoria k ON t.kategoria_id = k.kategoria_id
                WHERE t.termek_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getById($id)
    {
        return $this->findById($id);
    }

    public function updatePrice($productId, $price)
    {
        $sql = "UPDATE " . $this->table . " SET alap_ar_ft = :price WHERE termek_id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ':price' => $price,
            ':id' => $productId
        ]);
    }

    public function toggleAvailability($productId, $available)
    {
        if ($available) {
            $sql = "UPDATE raktar SET mennyiseg = CASE WHEN mennyiseg = 0 THEN 10 ELSE mennyiseg END WHERE termek_id = :id";
        } else {
            $sql = "UPDATE raktar SET mennyiseg = 0 WHERE termek_id = :id";
        }
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ':id' => $productId
        ]);
    }

    public function getAllWithCategory()
    {
        $sql = "SELECT t.*, k.nev as kategoria_nev
                FROM " . $this->table . " t
                LEFT JOIN kategoria k ON t.kategoria_id = k.kategoria_id
                ORDER BY t.csapatnev";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
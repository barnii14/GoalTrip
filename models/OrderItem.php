<?php
namespace Models;

use PDO;

class OrderItem
{
    private $conn;
    private $table = 'rendeles_tetelek';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function create($orderId, $productId, $sizeId, $qty, $price)
    {
        $query = "INSERT INTO " . $this->table . "
                  (rendeles_id, termek_id, meret_id, darabszam, ar)
                  VALUES (:oid, :pid, :sid, :qty, :price)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            ':oid' => $orderId,
            ':pid' => $productId,
            ':sid' => $sizeId,
            ':qty' => $qty,
            ':price' => $price
        ]);
    }
}
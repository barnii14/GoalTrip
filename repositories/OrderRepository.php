<?php
namespace Repositories;

use PDO;

class OrderRepository
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function createOrder($userId, $items, $shipping, $payment, $customer)
    {
        try {
            $this->conn->beginTransaction();

            $total = 0;
            foreach ($items as $item) {
                $quantity = isset($item['quantity']) ? (int) $item['quantity'] : ((int) ($item['qty'] ?? 1));
                $total += ($item['price'] ?? 0) * $quantity;
            }

            $shippingFee = 0;
            if ($shipping === 'box') {
                $shippingFee = 990;
            } elseif ($shipping === 'courier') {
                $shippingFee = 1990;
            }
            $total += $shippingFee;

            $query = "INSERT INTO rendelesek 
                      (felhasznalo_id, nev, email, cim, szallitas_mod, fizetes_mod, osszeg, allapot, datum)
                      VALUES (:uid, :name, :email, :address, :shipping, :payment, :total, 'feldolgozas', NOW())";
            
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute([
                ':uid' => $userId,
                ':name' => $customer['name'],
                ':email' => $customer['email'],
                ':address' => $customer['address'],
                ':shipping' => $shipping,
                ':payment' => $payment,
                ':total' => $total
            ]);
            
            if (!$result) {
                throw new \Exception("Rendelés beszúrása sikertelen: " . print_r($stmt->errorInfo(), true));
            }
            
            $orderId = $this->conn->lastInsertId();

            foreach ($items as $item) {
                $productId = $item['productId'] ?? $item['termek_id'] ?? null;
                $quantity = isset($item['quantity']) ? (int) $item['quantity'] : ((int) ($item['qty'] ?? 1));
                $price = isset($item['price']) ? (float) $item['price'] : 0;
                $sizeId = $this->mapSizeId($item['size'] ?? 'M');

                $queryItem = "INSERT INTO rendeles_tetelek 
                              (rendeles_id, termek_id, meret_id, darabszam, ar)
                              VALUES (:oid, :productId, :sizeId, :qty, :price)";
                
                $stmtItem = $this->conn->prepare($queryItem);
                $itemResult = $stmtItem->execute([
                    ':oid' => $orderId,
                    ':productId' => $productId,
                    ':sizeId' => $sizeId,
                    ':qty' => $quantity,
                    ':price' => $price
                ]);
                
                if (!$itemResult) {
                    throw new \Exception("Tétel beszúrása sikertelen: " . print_r($stmtItem->errorInfo(), true));
                }
            }

            $queryPayment = "INSERT INTO fizetes (rendeles_id, fizetes_modja, fizetes_allapot, fizetes_datuma)
                             VALUES (:oid, :method, 'pending', NOW())";
            $stmtPayment = $this->conn->prepare($queryPayment);
            $paymentResult = $stmtPayment->execute([
                ':oid' => $orderId,
                ':method' => $payment
            ]);
            
            if (!$paymentResult) {
                throw new \Exception("Fizetés beszúrása sikertelen: " . print_r($stmtPayment->errorInfo(), true));
            }

            $this->conn->commit();
            return $orderId;

        } catch (\Exception $e) {
            $this->conn->rollBack();
            error_log("Rendelés mentési hiba: " . $e->getMessage());
            return false;
        }
    }

    private function mapSizeId($size)
    {
        $mapping = [
            'S' => 1,
            'M' => 2,
            'L' => 3,
            'XL' => 4,
            'XXL' => 5,
        ];

        $upper = strtoupper(trim($size));
        return $mapping[$upper] ?? 2;
    }

    public function findByUserId($userId)
    {
        $query = "SELECT * FROM rendelesek WHERE felhasznalo_id = :uid ORDER BY datum DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':uid' => $userId]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($orders as &$order) {
            $order['items'] = [];

            $itemsQuery = "SELECT rt.*, t.csapatnev, t.kep_url, m.meret_nev as size_name
                           FROM rendeles_tetelek rt
                           LEFT JOIN termekek t ON rt.termek_id = t.termek_id
                           LEFT JOIN meretek m ON rt.meret_id = m.meret_id
                           WHERE rt.rendeles_id = :oid";
            $stmtItems = $this->conn->prepare($itemsQuery);
            $stmtItems->execute([':oid' => $order['rendeles_id']]);
            $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

            foreach ($items as $item) {
                $order['items'][] = [
                    'productId' => isset($item['termek_id']) ? (int) $item['termek_id'] : null,
                    'team' => $item['csapatnev'] ?? null,
                    'image' => $item['kep_url'] ?? null,
                    'price' => isset($item['ar']) ? (float) $item['ar'] : 0,
                    'qty' => isset($item['darabszam']) ? (int) $item['darabszam'] : 0,
                    'size' => $item['size_name'] ?? null,
                ];
            }
        }

        return $orders;
    }
}
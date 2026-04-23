<?php
namespace Controllers;

use Config\Database;
use Middlewares\AuthMiddleware;
use Utils\Response;
use PDO;

class AdminController
{
    private $conn;

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    private function requireAdmin()
    {
        $authUser = AuthMiddleware::authenticate();
        $stmt = $this->conn->prepare("SELECT felhasznalo_id, isAdmin FROM felhasznalok WHERE felhasznalo_id = :id LIMIT 1");
        $stmt->execute([':id' => (int) ($authUser['user_id'] ?? 0)]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || (int) ($user['isAdmin'] ?? 0) !== 1) {
            Response::error('Nincs jogosultság az admin művelethez', 403);
        }

        return $user;
    }

    public function getStats()
    {
        $this->requireAdmin();

        $usersCount = (int) $this->conn->query("SELECT COUNT(*) FROM felhasznalok")->fetchColumn();
        $ordersCount = (int) $this->conn->query("SELECT COUNT(*) FROM rendelesek")->fetchColumn();
        $productsCount = (int) $this->conn->query("SELECT COUNT(*) FROM termekek")->fetchColumn();
        $pendingOrders = (int) $this->conn->query("SELECT COUNT(*) FROM rendelesek WHERE LOWER(allapot) LIKE '%feldolgo%'")->fetchColumn();
        $totalRevenue = (float) $this->conn->query("SELECT COALESCE(SUM(osszeg),0) FROM rendelesek WHERE LOWER(allapot) NOT LIKE '%torol%'")->fetchColumn();

        Response::success('Statisztikák betöltve', [
            'usersCount' => $usersCount,
            'ordersCount' => $ordersCount,
            'productsCount' => $productsCount,
            'pendingOrders' => $pendingOrders,
            'totalRevenue' => $totalRevenue
        ]);
    }

    public function getAllUsers()
    {
        $this->requireAdmin();

        $sql = "SELECT felhasznalo_id, nev, email, telefonszam, cim, regisztracio_datuma, isAdmin
                FROM felhasznalok
                ORDER BY regisztracio_datuma DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::success('Felhasználók betöltve', ['users' => $users]);
    }

    public function updateUserRole($id)
    {
        $this->requireAdmin();
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['isAdmin'])) {
            Response::error('Hiányzó isAdmin mező', 400);
        }

        $stmt = $this->conn->prepare("UPDATE felhasznalok SET isAdmin = :isAdmin WHERE felhasznalo_id = :id");
        $stmt->execute([
            ':isAdmin' => !empty($data['isAdmin']) ? 1 : 0,
            ':id' => (int) $id
        ]);

        Response::success('Felhasználói szerepkör frissítve');
    }

    public function deleteUser($id)
    {
        $this->requireAdmin();
        $id = (int) $id;

        if ($id <= 0) {
            Response::error('Érvénytelen felhasználó azonosító', 400);
        }

        $stmt = $this->conn->prepare("DELETE FROM felhasznalok WHERE felhasznalo_id = :id");
        $stmt->execute([':id' => $id]);

        Response::success('Felhasználó törölve');
    }

    public function getAllOrders()
    {
        $this->requireAdmin();

        $sql = "SELECT r.rendeles_id, r.felhasznalo_id, r.nev, r.email, r.cim, r.szallitas_mod, r.fizetes_mod,
                       r.datum, r.allapot, r.osszeg,
                       COUNT(rt.rendeles_tetel_id) AS tetelek_szama
                FROM rendelesek r
                LEFT JOIN rendeles_tetelek rt ON rt.rendeles_id = r.rendeles_id
                GROUP BY r.rendeles_id
                ORDER BY r.datum DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::success('Rendelések betöltve', ['orders' => $orders]);
    }

    public function updateOrderStatus($id)
    {
        $this->requireAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        $status = trim((string) ($data['status'] ?? ''));
        if ($status === '') {
            Response::error('Hiányzó státusz', 400);
        }

        $stmt = $this->conn->prepare("UPDATE rendelesek SET allapot = :status WHERE rendeles_id = :id");
        $stmt->execute([
            ':status' => $status,
            ':id' => (int) $id
        ]);

        Response::success('Rendelés státusz frissítve');
    }

    public function getAllProducts()
    {
        $this->requireAdmin();

        $sql = "SELECT t.termek_id, t.csapatnev, t.leiras, t.alap_ar_ft, t.kep_url, k.nev AS kategoria,
                       COALESCE(SUM(r.mennyiseg), 0) AS keszlet,
                       CASE WHEN COALESCE(SUM(r.mennyiseg), 0) > 0 THEN 1 ELSE 0 END AS available
                FROM termekek t
                LEFT JOIN kategoria k ON k.kategoria_id = t.kategoria_id
                LEFT JOIN raktar r ON r.termek_id = t.termek_id
                GROUP BY t.termek_id
                ORDER BY t.termek_id DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::success('Termékek betöltve', ['products' => $products]);
    }

    public function toggleProductAvailability($id)
    {
        $this->requireAdmin();
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['available'])) {
            Response::error('Hiányzó available mező', 400);
        }

        $available = !empty($data['available']);
        $productId = (int) $id;

        if ($available) {
            $sql = "UPDATE raktar SET mennyiseg = CASE WHEN mennyiseg = 0 THEN 10 ELSE mennyiseg END WHERE termek_id = :id";
        } else {
            $sql = "UPDATE raktar SET mennyiseg = 0 WHERE termek_id = :id";
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([':id' => $productId]);

        Response::success('Termék elérhetőség frissítve');
    }

    public function updateProductPrice($id)
    {
        $this->requireAdmin();
        $data = json_decode(file_get_contents("php://input"), true);
        $price = isset($data['price']) ? (float) $data['price'] : null;

        if ($price === null || $price < 0) {
            Response::error('Érvénytelen ár', 400);
        }

        $stmt = $this->conn->prepare("UPDATE termekek SET alap_ar_ft = :price WHERE termek_id = :id");
        $stmt->execute([
            ':price' => $price,
            ':id' => (int) $id
        ]);

        Response::success('Termék ár frissítve');
    }

    public function getSalesReport()
    {
        $this->requireAdmin();

        $sql = "SELECT DATE(datum) AS nap, COUNT(*) AS rendelesek_szama, COALESCE(SUM(osszeg), 0) AS ossz_ertek
                FROM rendelesek
                GROUP BY DATE(datum)
                ORDER BY nap DESC
                LIMIT 30";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Response::success('Értékesítési riport betöltve', ['report' => $rows]);
    }
}
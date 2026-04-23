<?php
namespace Controllers;

use Config\Database;
use Middlewares\AuthMiddleware;
use Repositories\OrderRepository;
use Utils\Response;

class OrderController
{
    private $orderRepo;

    public function __construct()
    {
        $db = new Database();
        $conn = $db->getConnection();
        $this->orderRepo = new OrderRepository($conn);
    }

    public function store()
    {
        try {
            $user = AuthMiddleware::tryAuthenticate();
            $userId = $user['user_id'] ?? 1;
            $data = json_decode(file_get_contents("php://input"), true);

            // Adatok ellenőrzése
            if (!isset($data['items']) || !is_array($data['items']) || count($data['items']) === 0) {
                Response::error('Nincsenek tételek a rendelésben', 400);
            }

            $required = ['shipping', 'payment', 'customer'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    Response::error("Hiányzó mező: $field", 400);
                }
            }

            $customer = $data['customer'];
            if (empty($customer['name']) || empty($customer['email']) || empty($customer['address'])) {
                Response::error('Hiányzó vevő adatok (név, email, cím)', 400);
            }

            $orderId = $this->orderRepo->createOrder(
                $userId,
                $data['items'],
                $data['shipping'],
                $data['payment'],
                $customer
            );

            if ($orderId) {
                Response::success('Rendelés sikeresen rögzítve', ['order_id' => $orderId], 201);
            } else {
                Response::error('Hiba a rendelés mentésekor', 500);
            }
        } catch (\Exception $e) {
            error_log("OrderController hiba: " . $e->getMessage());
            Response::error('Szerver hiba: ' . $e->getMessage(), 500);
        }
    }

    public function index()
    {
        $user = AuthMiddleware::tryAuthenticate();
        $userId = $user['user_id'] ?? 1;
        $orders = $this->orderRepo->findByUserId($userId);
        Response::json($orders);
    }
}
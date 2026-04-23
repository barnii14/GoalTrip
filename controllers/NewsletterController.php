<?php
namespace Controllers;

use Config\Database;
use Models\Newsletter;
use Utils\Response;

class NewsletterController
{
    private $newsletterModel;

    public function __construct()
    {
        $db = new Database();
        $conn = $db->getConnection();
        $this->newsletterModel = new Newsletter($conn);
    }

    public function subscribe()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Érvénytelen email cím', 400);
        }

        if ($this->newsletterModel->exists($data['email'])) {
            Response::error('Az email már fel van iratkozva', 409);
        }

        if ($this->newsletterModel->subscribe($data['email'])) {
            Response::success('Sikeres feliratkozás', null, 201);
        } else {
            Response::error('Hiba a mentés során', 500);
        }
    }
}
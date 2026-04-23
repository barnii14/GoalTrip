<?php
namespace Config;

use PDO;
use PDOException;
use Dotenv\Dotenv;
use RuntimeException;

class Database
{
    private $conn;

    public function __construct()
    {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->load();
    }

    public function getConnection()
    {
        $this->conn = null;
        try {
            $port = $_ENV['DB_PORT'] ?? 3306;
            $this->conn = new PDO(
                "mysql:host=" . $_ENV['DB_HOST'] . ";port=" . $port . ";dbname=" . $_ENV['DB_NAME'],
                $_ENV['DB_USER'],
                $_ENV['DB_PASS']
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch (PDOException $e) {
            throw new RuntimeException('Database connection failed', 0, $e);
        }
        return $this->conn;
    }
}
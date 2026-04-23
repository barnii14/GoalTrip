<?php
namespace Controllers;

use Config\Database;
use Repositories\ProductRepository;
use Utils\Response;

class ProductController
{
    private $productRepo;

    public function __construct()
    {
        $db = new Database();
        $conn = $db->getConnection();
        $this->productRepo = new ProductRepository($conn);
    }

    public function index()
    {
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        $filters = [
            'category' => $category,
            'search' => $search,
        ];

        $products = $this->productRepo->getAll($filters);
        $mapped = array_map([$this, 'mapProduct'], $products);

        Response::json($mapped);
    }

    private function mapProduct($product)
    {
        return [
            'id' => (int) $product['termek_id'],
            'team' => $product['csapatnev'],
            'name' => $product['csapatnev'],
            'league' => $this->parseLeague($product['kep_url']),
            'category' => $product['kategoria_nev'] ?? null,
            'description' => $product['leiras'] ?? null,
            'price' => isset($product['alap_ar_ft']) ? (float) $product['alap_ar_ft'] : 0,
            'image' => $product['kep_url'] ?? null,
            'sizes' => ['S', 'M', 'L', 'XL', 'XXL'],
            'kitType' => $this->parseKitType($product['kep_url']),
        ];
    }

    private function parseLeague($url)
    {
        if (!$url) {
            return 'unknown';
        }

        if (preg_match('#/kits/([^/]+)/#', $url, $matches)) {
            return $matches[1];
        }

        return 'unknown';
    }

    private function parseKitType($url)
    {
        if (!$url) {
            return 'home';
        }

        if (preg_match('#/(home|away|third)\.png$#', $url, $matches)) {
            return $matches[1];
        }

        return 'home';
    }

    public function getLeagues()
    {
        $db = (new Database())->getConnection();
        $sql = "SELECT kep_url FROM termekek WHERE kategoria_id = 1 AND kep_url IS NOT NULL";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $urls = $stmt->fetchAll(\PDO::FETCH_COLUMN);

        $leagues = [];
        foreach ($urls as $url) {
            $league = $this->parseLeague($url);
            if ($league && !in_array($league, $leagues, true)) {
                $leagues[] = $league;
            }
        }

        sort($leagues, SORT_STRING);
        Response::json($leagues);
    }

    public function getTeams()
    {
        $liga = $_GET['liga'] ?? null;
        $db = (new Database())->getConnection();
        $sql = "SELECT DISTINCT csapatnev, kep_url FROM termekek WHERE csapatnev IS NOT NULL";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        $teams = [];
        foreach ($rows as $row) {
            $league = $this->parseLeague($row['kep_url']);
            if ($liga && $liga !== 'all' && $league !== $liga) {
                continue;
            }
            if (!in_array($row['csapatnev'], array_column($teams, 'team'), true)) {
                $teams[] = [
                    'team' => $row['csapatnev'],
                    'league' => $league,
                ];
            }
        }

        usort($teams, function ($a, $b) {
            return strcmp($a['team'], $b['team']);
        });

        Response::json($teams);
    }
}
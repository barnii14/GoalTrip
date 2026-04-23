<?php
namespace Repositories;

use Models\Product;

class ProductRepository
{
    private $productModel;

    public function __construct($db)
    {
        $this->productModel = new Product($db);
    }

    public function getAll($filters = [])
    {
        return $this->productModel->getAll($filters);
    }

    public function findById($id)
    {
        return $this->productModel->findById($id);
    }

    public function updatePrice($productId, $price)
    {
        return $this->productModel->updatePrice($productId, $price);
    }

    public function toggleAvailability($productId, $available)
    {
        return $this->productModel->toggleAvailability($productId, $available);
    }

    public function getAllWithCategory()
    {
        return $this->productModel->getAllWithCategory();
    }
}
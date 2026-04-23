<?php
namespace Repositories;

use Models\User;

class UserRepository
{
    private $userModel;

    public function __construct($db)
    {
        $this->userModel = new User($db);
    }

    public function findByEmail($email)
    {
        return $this->userModel->findByEmail($email);
    }

    public function findById($id)
    {
        return $this->userModel->findById($id);
    }

    public function create($data)
    {
        return $this->userModel->create($data);
    }

    public function updatePassword($userId, $hashedPassword)
    {
        return $this->userModel->updatePassword($userId, $hashedPassword);
    }

    public function getAllUsers()
    {
        return $this->userModel->getAllUsers();
    }

    public function updateRole($userId, $isAdmin)
    {
        return $this->userModel->updateRole($userId, $isAdmin);
    }

    public function delete($userId)
    {
        return $this->userModel->delete($userId);
    }
}
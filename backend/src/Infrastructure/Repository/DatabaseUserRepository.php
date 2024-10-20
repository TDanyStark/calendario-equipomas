<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Infrastructure\Database;
use App\Domain\User\UserRepository;
use App\Domain\User\User;
use PDO;

class DatabaseUserRepository implements UserRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        $this->pdo = $database->getConnection();
    }

    public function findUserById(string $id): ?User
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE UserID = :id');
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Si no se encuentra el usuario, retorna null
        if ($data === false) {
            return null; // Aquí retorna null en lugar de false
        }

        return new User($data['UserID'], $data['UserEmail'], $data['UserPassword'], $data['RoleID']);
    }
}

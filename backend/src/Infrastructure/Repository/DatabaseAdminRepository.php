<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Admin\AdminRepository;
use App\Infrastructure\Database;
use App\Domain\Admin\Admin;
use App\Domain\User\User;
use PDO;

class DatabaseAdminRepository implements AdminRepository
{
  private PDO $pdo;

  public function __construct(Database $database)
  {
    $this->pdo = $database->getConnection();
  }

  public function findAdminById(string $id): ?Admin
{
    $stmt = $this->pdo->prepare('
        SELECT a.AdminID, a.AdminFirstName, a.AdminLastName, 
               u.UserID, u.UserEmail, u.UserPassword, u.RoleID 
        FROM admins a
        JOIN users u ON a.AdminID = u.UserID
        WHERE a.AdminID = :id
    ');
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data === false) {
        return null;
    }

    // Crear el objeto User usando los datos obtenidos
    $user = new User($data['UserID'], $data['UserEmail'], $data['UserPassword'], $data['RoleID']);
    
    return new Admin($data['AdminID'], $data['AdminFirstName'], $data['AdminLastName'], $user);
}
}

<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Role\Role;
use App\Domain\Role\RoleRepository;
use App\Infrastructure\Database;

use PDO;

class DatabaseRoleRepository implements RoleRepository
{
    private PDO $db;

    public function __construct(Database $database)
    {
        $this->db = $database->getConnection();
    }

    public function getRoleById(int $roleID): ?Role
    {
        $query = "SELECT RoleID, RoleName FROM roles WHERE RoleID = :RoleID";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':RoleID', $roleID);
        $stmt->execute();

        $result = $stmt->fetch();
        if ($result) {
            return new Role((int)$result['RoleID'], $result['RoleName']);
        }

        return null; // Retorna null si no se encuentra el rol
    }
}

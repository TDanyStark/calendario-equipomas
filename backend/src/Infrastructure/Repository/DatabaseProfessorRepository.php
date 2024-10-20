<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Professor\Professor;
use App\Domain\Professor\ProfessorNotFoundException;
use App\Domain\Professor\ProfessorRepository;
use App\Infrastructure\Database;
use App\Domain\User\User;
use PDO;

class DatabaseProfessorRepository implements ProfessorRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        // Obtiene la conexión desde la clase Database
        $this->pdo = $database->getConnection();
    }

    public function findProfessorById(string $id): ?Professor
    {
        $stmt = $this->pdo->prepare('
            SELECT p.ProfessorID, p.ProfessorFirstName, p.ProfessorLastName, p.ProfessorPhone, p.ProfessorStatus, 
                   u.UserID, u.UserEmail, u.UserPassword, u.RoleID 
            FROM professors p
            JOIN users u ON p.ProfessorID = u.UserID
            WHERE p.ProfessorID = :id
        ');
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data === false) {
            throw new ProfessorNotFoundException("Professor not found for ID: $id");
        }

        // Crear el objeto User usando los datos obtenidos
        $user = new User($data['UserID'], $data['UserEmail'], $data['UserPassword'], $data['RoleID']);

        // Crea y devuelve el objeto Professor
        return new Professor($data['ProfessorID'], $data['ProfessorFirstName'], $data['ProfessorLastName'],$data['ProfessorPhone'], $data['ProfessorStatus'], $user);
    }
}

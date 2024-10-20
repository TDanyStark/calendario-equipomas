<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Professor\Professor;
use App\Domain\Professor\ProfessorRepository;
use App\Infrastructure\Database;
use PDO;

class DatabaseProfessorRepository implements ProfessorRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        // Usamos la conexión proporcionada por la clase Database
        $this->pdo = $database->getConnection();
    }

    public function findProfessorByEmail(string $email): ?Professor
    {
        $stmt = $this->pdo->prepare('SELECT ProfessorID, ProfessorFirstName, ProfessorLastName, ProfessorEmail, ProfessorPhone, ProfessorStatus FROM Professors WHERE ProfessorEmail = :email');
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            return new Professor(
                $row['ProfessorID'],
                $row['ProfessorFirstName'],
                $row['ProfessorLastName'],
                $row['ProfessorEmail'],
                $row['ProfessorPhone'] ?? null,
                $row['ProfessorStatus']
            );
        }

        return null;
    }
}

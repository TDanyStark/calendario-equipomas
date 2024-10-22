<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Student\Student;
use App\Domain\Student\StudentNotFoundException;
use App\Domain\Student\StudentRepository;
use App\Infrastructure\Database;
use App\Domain\User\User;
use PDO;

class DatabaseStudentRepository implements StudentRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        // Obtiene la conexión desde la clase Database
        $this->pdo = $database->getConnection();
    }

    public function findStudentOfId(string $id): Student
    {
        $stmt = $this->pdo->prepare('
        SELECT s.StudentID, s.StudentFirstName, s.StudentLastName, s.StudentPhone, s.StudentStatus,
               u.UserID, u.UserEmail, u.UserPassword, u.RoleID 
        FROM students s
        JOIN users u ON s.StudentID = u.UserID
        WHERE s.StudentID = :id
    ');
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data === false) {
            throw new StudentNotFoundException("Student not found for ID: $id");
        }

        // Crear el objeto User usando los datos obtenidos
        $user = new User($data['UserID'], $data['UserEmail'], $data['UserPassword'], $data['RoleID']);

        return new Student($data['StudentID'], $data['StudentFirstName'], $data['StudentLastName'], $data['StudentPhone'], $data['StudentStatus'], $user);
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('
        SELECT s.StudentID, s.StudentFirstName, s.StudentLastName, s.StudentPhone, s.StudentStatus,
               u.UserID, u.UserEmail, u.UserPassword, u.RoleID 
        FROM students s
        JOIN users u ON s.StudentID = u.UserID
    ');

        $students = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Crear el objeto User usando los datos obtenidos
            $user = new User($data['UserID'], $data['UserEmail'], $data['UserPassword'], $data['RoleID']);

            $students[] = new Student($data['StudentID'], $data['StudentFirstName'], $data['StudentLastName'], $data['StudentPhone'], $data['StudentStatus'], $user);
        }

        return $students;
    }
}

<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Student\Student;
use App\Domain\Student\StudentNotFoundException;
use App\Domain\Student\StudentRepository;
use App\Infrastructure\Database;
use PDO;

class DatabaseStudentRepository implements StudentRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        // Obtiene la conexión desde la clase Database
        $this->pdo = $database->getConnection();
    }

    /**
     * @return Student[]
     */
    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT StudentID, StudentFirstName, StudentLastName, StudentEmail, StudentPhone, StudentStatus FROM Students');
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $students = [];
        foreach ($results as $row) {
            $students[] = new Student(
                $row['StudentID'],
                $row['StudentFirstName'],
                $row['StudentLastName'],
                $row['StudentEmail'],
                $row['StudentPhone'] ?? null,
                $row['StudentStatus']
            );
        }

        return $students;
    }

    /**
     * Encuentra un estudiante por su ID.
     * 
     * @param string $id
     * @return Student
     * @throws StudentNotFoundException
     */
    public function findStudentOfId(string $id): Student
    {
        $stmt = $this->pdo->prepare('SELECT StudentID, StudentFirstName, StudentLastName, StudentEmail, StudentPhone, StudentStatus FROM Students WHERE StudentID = :id');
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            throw new StudentNotFoundException();
        }

        return new Student(
            $row['StudentID'],
            $row['StudentFirstName'],
            $row['StudentLastName'],
            $row['StudentEmail'],
            $row['StudentPhone'] ?? null,
            $row['StudentStatus']
        );
    }

    /**
     * Encuentra un estudiante por su email.
     * 
     * @param string $email
     * @return Student|null
     */
    public function findStudentByEmail(string $email): ?Student
    {
        $stmt = $this->pdo->prepare('SELECT StudentID, StudentFirstName, StudentLastName, StudentEmail, StudentPhone, StudentStatus FROM Students WHERE StudentEmail = :email');
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            return new Student(
                $row['StudentID'],
                $row['StudentFirstName'],
                $row['StudentLastName'],
                $row['StudentEmail'],
                $row['StudentPhone'] ?? null,
                $row['StudentStatus']
            );
        }

        return null;
    }
}
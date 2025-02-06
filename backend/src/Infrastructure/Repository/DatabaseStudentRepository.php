<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Services\PasswordService;
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

    public function findStudentById(string $id): Student
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
        ORDER BY s.Update_at DESC
    ');

        $students = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Crear el objeto User usando los datos obtenidos
            $user = new User($data['UserID'], $data['UserEmail'], $data['UserPassword'], $data['RoleID']);

            $students[] = new Student($data['StudentID'], $data['StudentFirstName'], $data['StudentLastName'], $data['StudentPhone'], $data['StudentStatus'], $user);
        }

        return $students;
    }

    public function create(Student $student): int
    {
        // crear user con una transacción
        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare('
                INSERT INTO users (UserID, UserEmail, UserPassword, RoleID)
                VALUES (:id, :email, :password, :roleID)
            ');
            $stmt->execute([
                'id' => $student->getStudentID(),
                'email' => $student->getUser()->getEmail(),
                'password' => PasswordService::hash($student->getUser()->getPassword()),
                'roleID' => $student->getUser()->getRoleID()
            ]);

            $stmt = $this->pdo->prepare('
                INSERT INTO students (StudentID, StudentFirstName, StudentLastName, StudentPhone, StudentStatus)
                VALUES (:id, :firstName, :lastName, :phone, :status)
            ');
            $stmt->execute([
                'id' => $student->getStudentID(),
                'firstName' => $student->getFirstName(),
                'lastName' => $student->getLastName(),
                'phone' => $student->getPhone(),
                'status' => $student->getStatus()
            ]);

            $this->pdo->commit();
            return (int)$this->pdo->lastInsertId();
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            // Verificar si el error es una violación de clave duplicada
            if ($e->getCode() === '23000') {
                throw new \DomainException("El ID proporcionado ya existe en la base de datos.");
            }

            // Re-lanzar la excepción si no es del tipo esperado
            throw $e;
        }
    }

    public function update(Student $student): bool
    {
        $stmt = $this->pdo->prepare('
            UPDATE students
            SET StudentFirstName = :firstName, StudentLastName = :lastName, StudentPhone = :phone, StudentStatus = :status
            WHERE StudentID = :id
        ');
        $stmt->execute([
            'id' => $student->getStudentID(),
            'firstName' => $student->getFirstName(),
            'lastName' => $student->getLastName(),
            'phone' => $student->getPhone(),
            'status' => $student->getStatus()
        ]);

        return $stmt->rowCount() > 0;
    }

    public function delete(string $id): bool
    {
        $stmt = $this->pdo->prepare('
            DELETE FROM users WHERE UserID = :id
        ');
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    public function deleteMultiple(array $ids): int
    {
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $this->pdo->prepare("DELETE FROM users WHERE UserID IN ($placeholders)");
        $stmt->execute($ids);

        return $stmt->rowCount();
    }
}

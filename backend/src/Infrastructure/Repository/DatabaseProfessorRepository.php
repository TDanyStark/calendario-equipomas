<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Professor\Professor;
use App\Domain\Professor\ProfessorRepository;
use App\Domain\User\User;
use PDO;
use App\Infrastructure\Database;

class DatabaseProfessorRepository implements ProfessorRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        $this->pdo = $database->getConnection();
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query("SELECT p.*, u.UserID, u.UserEmail, u.UserPassword, u.RoleID FROM professors p INNER JOIN users u ON p.ProfessorID = u.UserID WHERE p.ProfessorIsDelete = 0");
        $professors = [];
        while ($row = $stmt->fetch()) {
            $user = new User($row['UserID'], $row['UserEmail'], $row['UserPassword'], (int)$row['RoleID']);
            $professors[] = new Professor(
                (string)$row['ProfessorID'],
                $row['ProfessorFirstName'],
                $row['ProfessorLastName'],
                $row['ProfessorPhone'],
                $row['ProfessorStatus'],
                $user
            );
        }
        return $professors;
    }

    public function findProfessorById(string $id): ?Professor
    {
        $stmt = $this->pdo->prepare(
            "SELECT p.*, u.UserID, u.UserEmail, u.UserPassword, u.RoleID FROM professors p INNER JOIN users u ON p.ProfessorID = u.UserID WHERE p.ProfessorID = :id AND p.ProfessorIsDelete = 0"
        );
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        if ($row) {
            $user = new User($row['UserID'], $row['UserEmail'], $row['UserPassword'], (int)$row['RoleID']);
            return new Professor(
                (string)$row['ProfessorID'],
                $row['ProfessorFirstName'],
                $row['ProfessorLastName'],
                $row['ProfessorPhone'],
                $row['ProfessorStatus'],
                $user
            );
        }

        return null;
    }

    public function create(Professor $professor): int
    {
        $this->pdo->beginTransaction();

        try {
            // Insertar en la tabla users
            $stmtUser = $this->pdo->prepare(
                "INSERT INTO users (UserID, UserEmail, UserPassword, RoleID) VALUES (:userID, :email, :password, :roleID)"
            );
            $stmtUser->execute([
                'userID' => $professor->getProfessorID(), // Usar ProfessorID como UserID
                'email' => $professor->getUser()->getEmail(),
                'password' => $professor->getUser()->getPassword(),
                'roleID' => $professor->getUser()->getRoleID()
            ]);

            // Insertar en la tabla professors
            $stmtProfessor = $this->pdo->prepare(
                "INSERT INTO professors (ProfessorID, ProfessorFirstName, ProfessorLastName, ProfessorPhone, ProfessorStatus) VALUES (:id, :firstName, :lastName, :phone, :status)"
            );
            $stmtProfessor->execute([
                'id' => $professor->getProfessorID(),
                'firstName' => $professor->getFirstName(),
                'lastName' => $professor->getLastName(),
                'phone' => $professor->getPhone(),
                'status' => $professor->getStatus(),
            ]);

            $this->pdo->commit();

            return (int)$this->pdo->lastInsertId();
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }


    public function update(Professor $professor): bool
    {
        $this->pdo->beginTransaction();

        try {
            // Actualizar en la tabla users
            $stmtUser = $this->pdo->prepare(
                "UPDATE users SET UserEmail = :email, UserPassword = :password, RoleID = :roleID WHERE UserID = :userID"
            );
            $stmtUser->execute([
                'email' => $professor->getUser()->getEmail(),
                'password' => $professor->getUser()->getPassword(),
                'roleID' => $professor->getUser()->getRoleID(),
                'userID' => $professor->getProfessorID()
            ]);

            // Actualizar en la tabla professors
            $stmtProfessor = $this->pdo->prepare(
                "UPDATE professors SET ProfessorFirstName = :firstName, ProfessorLastName = :lastName, ProfessorPhone = :phone, ProfessorStatus = :status WHERE ProfessorID = :id"
            );
            $stmtProfessor->execute([
                'firstName' => $professor->getFirstName(),
                'lastName' => $professor->getLastName(),
                'phone' => $professor->getPhone(),
                'status' => $professor->getStatus(),
                'id' => $professor->getProfessorID()
            ]);

            $this->pdo->commit();
            return true;
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function delete(string $id): bool
    {
        try {
            $stmtUser = $this->pdo->prepare("DELETE FROM users WHERE UserID = :userID");
            return $stmtUser->execute(['userID' => $id]);
        } catch (\Exception $e) {
            throw $e; // Manejar la excepción si ocurre un error
        }
    }

    public function deleteMultiple(array $ids): int
    {
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $this->pdo->beginTransaction();

        try {
            // Eliminar de la tabla users (ON DELETE CASCADE se encargará de professors)
            $queryUser = "DELETE FROM users WHERE UserID IN ($placeholders)";
            $stmtUser = $this->pdo->prepare($queryUser);
            $stmtUser->execute($ids);

            $this->pdo->commit();
            return $stmtUser->rowCount();
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}

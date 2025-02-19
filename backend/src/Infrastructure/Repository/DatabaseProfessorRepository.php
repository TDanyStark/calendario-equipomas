<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Professor\Professor;
use App\Domain\Professor\ProfessorRepository;
use App\Domain\User\User;
use PDO;
use App\Infrastructure\Database;
use App\Domain\Professor\ProfessorInstruments;
use App\Domain\Professor\ProfessorRooms;
use App\Domain\Professor\ProfessorAvailability;
use App\Domain\Services\PasswordService;

class DatabaseProfessorRepository implements ProfessorRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        $this->pdo = $database->getConnection();
    }

    public function findAll(int $limit, int $offset, string $query, bool $offPagination, bool $onlyActive): array
    {
        $searchQuery = "%$query%";
    
        // Condición WHERE reutilizable
        $whereClause = '(:query = "" OR p.ProfessorID LIKE :query 
        OR p.ProfessorFirstName LIKE :query 
        OR p.ProfessorLastName LIKE :query 
        OR p.ProfessorPhone LIKE :query 
        OR p.ProfessorStatus LIKE :query 
        OR u.UserEmail LIKE :query) AND p.ProfessorIsDelete = 0';

        if ($onlyActive) {
            $whereClause .= ' AND p.ProfessorStatus = "activo"';
        }
    
        // Obtener cantidad total de registros
        $countStmt = $this->pdo->prepare("SELECT COUNT(*) as total FROM professors p 
        JOIN users u ON p.ProfessorID = u.UserID WHERE $whereClause");
        $countStmt->bindValue(':query', $searchQuery, PDO::PARAM_STR);
        $countStmt->execute();
        $totalRecords = (int) $countStmt->fetchColumn();
    
        // Calcular número de páginas
        $totalPages = $limit > 0 ? ceil($totalRecords / $limit) : 1;
    
        // Obtener datos paginados
        $dataStmt = $this->pdo->prepare("SELECT p.*, u.UserID, u.UserEmail, u.UserPassword, u.RoleID 
        FROM professors p 
        JOIN users u ON p.ProfessorID = u.UserID 
        WHERE $whereClause 
        ORDER BY p.Update_at DESC, p.ProfessorFirstName ASC 
        LIMIT :limit OFFSET :offset");
    
        $dataStmt->bindValue(':query', $searchQuery, PDO::PARAM_STR);
        $dataStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $dataStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $dataStmt->execute();
    
        $professors = [];
        // obtener los instrumentos, los salones, y la disponibilidad de los profesores
        

        while ($row = $dataStmt->fetch(PDO::FETCH_ASSOC)) {
            $user = new User($row['UserID'], $row['UserEmail'], $row['UserPassword'], (int)$row['RoleID']);
            $professors[] = new Professor(
                (string)$row['ProfessorID'],
                $row['ProfessorFirstName'],
                $row['ProfessorLastName'],
                $row['ProfessorPhone'],
                $row['ProfessorStatus'],
                $user,
            );
        }
    
        if ($offPagination) {
            return $professors;
        }
    
        return ['data' => $professors, 'pages' => $totalPages];
    }
    

    public function findProfessorById(string $id): ?Professor
    {
        // Obtener datos básicos del profesor
        $stmt = $this->pdo->prepare(
            "SELECT p.*, u.UserID, u.UserEmail, u.UserPassword, u.RoleID 
            FROM professors p 
            INNER JOIN users u ON p.ProfessorID = u.UserID 
            WHERE p.ProfessorID = :id AND p.ProfessorIsDelete = 0"
        );
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        if (!$row) return null;

        $user = new User($row['UserID'], $row['UserEmail'], $row['UserPassword'], (int)$row['RoleID']);

        return new Professor(
            (string)$row['ProfessorID'],
            $row['ProfessorFirstName'],
            $row['ProfessorLastName'],
            $row['ProfessorPhone'],
            $row['ProfessorStatus'],
            $user,
        );
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
                'password' => PasswordService::hash($professor->getUser()->getPassword()), // Usar ID como contraseña
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
            // Verificar si el error es una violación de clave duplicada
            if ($e->getCode() === '23000') {
                throw new \DomainException("El ID proporcionado ya existe en la base de datos.");
            }
            // Re-lanzar la excepción si no es del tipo esperado
            throw $e;
        }
    }


    public function update(Professor $professor): bool
    {
        $this->pdo->beginTransaction();

        try {
            // Actualizar datos básicos (existente)
            $this->updateUser($professor);
            $this->updateProfessor($professor);

            $this->pdo->commit();
            return true;
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    private function updateUser(Professor $professor): void
    {
        $stmt = $this->pdo->prepare("
        UPDATE users 
        SET 
            UserEmail = :email, 
            RoleID = :roleId 
        WHERE UserID = :userId
    ");

        $stmt->execute([
            'email' => $professor->getUser()->getEmail(),
            'roleId' => $professor->getUser()->getRoleID(),
            'userId' => $professor->getProfessorID() // Asumiendo que UserID = ProfessorID
        ]);
    }

    private function updateProfessor(Professor $professor): void
    {
        $stmt = $this->pdo->prepare("
        UPDATE professors 
        SET 
            ProfessorFirstName = :firstName, 
            ProfessorLastName = :lastName, 
            ProfessorPhone = :phone, 
            ProfessorStatus = :status
        WHERE ProfessorID = :professorId
    ");

        $stmt->execute([
            'firstName' => $professor->getFirstName(),
            'lastName' => $professor->getLastName(),
            'phone' => $professor->getPhone(),
            'status' => $professor->getStatus(),
            'professorId' => $professor->getProfessorID()
        ]);
    }

    private function updateInstruments(Professor $professor): void
    {
        // Eliminar existentes
        $this->pdo->prepare("DELETE FROM professor_instruments WHERE ProfessorID = ?")
            ->execute([$professor->getProfessorID()]);

        // // Insertar nuevos
        // foreach ($professor->getInstruments() as $instrument) {
        //     $this->pdo->prepare("INSERT INTO professor_instruments (ProfessorID, InstrumentID) VALUES (?, ?)")
        //         ->execute([$professor->getProfessorID(), $instrument->getInstrumentID()]);
        // }
    }

    private function updateRooms(Professor $professor): void
    {
        // Eliminar existentes
        $this->pdo->prepare("DELETE FROM professor_rooms WHERE ProfessorID = ?")
            ->execute([$professor->getProfessorID()]);

        // // Insertar nuevos
        // foreach ($professor->getRooms() as $room) {
        //     $this->pdo->prepare("INSERT INTO professor_rooms (ProfessorID, RoomID) VALUES (?, ?)")
        //         ->execute([$professor->getProfessorID(), $room->getRoomID()]);
        // }
    }

    private function updateAvailability(Professor $professor): void
    {
        // Eliminar existentes
        $this->pdo->prepare("DELETE FROM professor_availability WHERE ProfessorID = ?")
            ->execute([$professor->getProfessorID()]);

        // // Insertar nuevos
        // foreach ($professor->getAvailability() as $availability) {
        //     $this->pdo->prepare(
        //         "INSERT INTO professor_availability 
        //         (ProfessorID, DayID, StartTime, EndTime) 
        //         VALUES (?, ?, ?, ?)"
        //     )->execute([
        //         $professor->getProfessorID(),
        //         $availability->getDayID(),
        //         $availability->getStartTime(),
        //         $availability->getEndTime()
        //     ]);
        // }
    }

    public function delete(string $id): bool
    {
        try {
            // Actualizar la tabla professors
            $stmt = $this->pdo->prepare("
                UPDATE professors 
                SET ProfessorIsDelete = 1, Deleted_at = NOW() 
                WHERE ProfessorID = :id
            ");
            $stmt->execute(['id' => $id]);

            return $stmt->rowCount() > 0; // Devuelve true si se afectó al menos una fila
        } catch (\Exception $e) {
            throw $e; // Manejar la excepción si ocurre un error
        }
    }


    public function deleteMultiple(array $ids): int
    {
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $this->pdo->beginTransaction();

        try {
            // Actualizar la tabla professors
            $query = "
                UPDATE professors 
                SET ProfessorIsDelete = 1, Deleted_at = NOW() 
                WHERE ProfessorID IN ($placeholders)
            ";
            $stmt = $this->pdo->prepare($query);
            $stmt->execute($ids);

            $this->pdo->commit();

            return $stmt->rowCount(); // Devuelve el número de filas afectadas
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw $e; // Manejar la excepción si ocurre un error
        }
    }

    // Métodos auxiliares para relaciones
    private function getProfessorInstruments(string $professorId): array
    {
        $stmt = $this->pdo->prepare(
            "
            SELECT pi.*, i.InstrumentName
            FROM professor_instruments pi
            JOIN instruments i ON pi.InstrumentID = i.InstrumentID
            WHERE ProfessorID = :id
            ");
        $stmt->execute(['id' => $professorId]);

        $instruments = [];
        while ($row = $stmt->fetch()) {
            $instruments[] = new ProfessorInstruments(
                (int)$row['ProfessorInstrumentID'],
                $row['ProfessorID'],
                (int)$row['InstrumentID'],
                (int)$row['academic_period_id'],
                $row['InstrumentName']
            );
        }
        return $instruments;
    }

    private function getProfessorRooms(string $professorId): array
    {
        $stmt = $this->pdo->prepare(
            "SELECT * FROM professor_rooms WHERE ProfessorID = :id"
        );
        $stmt->execute(['id' => $professorId]);

        $rooms = [];
        while ($row = $stmt->fetch()) {
            $rooms[] = new ProfessorRooms(
                (int)$row['ProfessorRoomID'],
                $row['ProfessorID'],
                (int)$row['academic_period_id'],
                (int)$row['RoomID']
            );
        }
        return $rooms;
    }

    private function getProfessorAvailability(string $professorId): array
    {
        $stmt = $this->pdo->prepare(
            "SELECT * FROM professor_availability WHERE ProfessorID = :id ORDER BY DayID, StartTime, EndTime;"
        );
        $stmt->execute(['id' => $professorId]);

        $availability = [];
        while ($row = $stmt->fetch()) {
            $availability[] = new ProfessorAvailability(
                (int)$row['AvailabilityID'],
                $row['ProfessorID'],
                (int)$row['DayID'],
                (int) $row['academic_period_id'],
                $row['StartTime'],
                $row['EndTime']
            );
        }
        return $availability;
    }

    public function findProfessorByQuery(string $query): array
    {
        $searchQuery = "%$query%";

        $stmt = $this->pdo->prepare('
            SELECT p.ProfessorID, p.ProfessorFirstName, p.ProfessorLastName
            FROM professors p
            JOIN users u ON p.ProfessorID = u.UserID
            WHERE p.ProfessorIsDelete = 0 
            AND (
                p.ProfessorID LIKE :query
                OR CONCAT(p.ProfessorFirstName, " ", p.ProfessorLastName) LIKE :query
                OR p.ProfessorPhone LIKE :query
                OR p.ProfessorStatus LIKE :query
                OR u.UserEmail LIKE :query
            )
            
            ORDER BY p.ProfessorFirstName ASC
            LIMIT 5
        ');
        $stmt->bindParam(':query', $searchQuery, PDO::PARAM_STR);
        $stmt->execute();

        $professors = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $professors[] = [
                'id' => (string)$row['ProfessorID'],
                'name' => $row['ProfessorFirstName'] . ' ' . $row['ProfessorLastName']
            ];
        }
        return $professors;
    }

    public function findProfessorIdsActive(): array
    {
        $stmt = $this->pdo->prepare('
            SELECT p.ProfessorID
            FROM professors p
            WHERE p.ProfessorIsDelete = 0 AND p.ProfessorStatus = "activo"
        ');
        $stmt->execute();

        $professorIds = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $professorIds[] = (string)$row['ProfessorID'];
        }
        return $professorIds;
    }
}

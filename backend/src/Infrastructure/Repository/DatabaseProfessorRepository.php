<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Professor\Professor;
use App\Domain\Professor\ProfessorRepository;
use App\Domain\User\User;
use PDO;
use App\Infrastructure\Database;
use App\Domain\Professor\ProfessorInstruments;
use App\Domain\Professor\ProfessorContracts;
use App\Domain\Professor\ProfessorRooms;
use App\Domain\Professor\ProfessorAvailability;
use App\Domain\Services\PasswordService;
use Exception;
use PDOException;

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

    public function seedProfessors(): void
    {
        try {
            $this->pdo->beginTransaction();

            for ($i = 1; $i <= 20; $i++) {
                // Generamos un UserID de 10 dígitos: "22" + ceros intermedios + número del profesor
                $userID = sprintf("22%07d", $i);
                $email = "profesor{$i}@example.com";
                $password = password_hash($userID, PASSWORD_DEFAULT);
                $roleID = 2; // Asignamos el rol de profesor

                // Insertar en la tabla users
                $stmtUser = $this->pdo->prepare("INSERT INTO users (UserID, UserEmail, UserPassword, RoleID) VALUES (?, ?, ?, ?)");
                $stmtUser->execute([$userID, $email, $password, $roleID]);

                // Insertar en la tabla professors
                $stmtProf = $this->pdo->prepare("INSERT INTO professors (ProfessorID, ProfessorFirstName, ProfessorLastName, ProfessorPhone, ProfessorStatus) VALUES (?, ?, ?, ?, ?)");
                $stmtProf->execute([$userID, "Profesor {$i}", "Apellido {$i}", "555-100{$i}", "activo"]);
            }

            $this->pdo->commit();
            echo json_encode(["success" => "20 profesores insertados correctamente"]);
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            echo json_encode(["error" => "Error insertando profesores: " . $e->getMessage()]);
        }
    }

    private function AddInstrumentsProfessor(string $ID, array $professorInstrumentsArray): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO professor_instruments (ProfessorID, InstrumentID, academic_period_id) VALUES (:professorID, :instrumentID, :academicPeriodID)");
        foreach ($professorInstrumentsArray as $professorInstrument) {
            $stmt->execute([
                'professorID' => $ID,
                'instrumentID' => $professorInstrument->getInstrumentID(),
                'academicPeriodID' => $professorInstrument->getAcademicPeriodID()
            ]);
        }
    }

    private function DeleteInstrumentsProfessor(string $ID, array $professorInstrumentsArray): void
    {
        $stmt = $this->pdo->prepare("DELETE FROM professor_instruments WHERE ProfessorID = :professorID AND academic_period_id = :academicPeriodID");
        $stmt->execute(['professorID' => $ID, 'academicPeriodID' => $professorInstrumentsArray[0]->getAcademicPeriodID()]);
    }

    private function AddRoomsProfessor(string $ID, array $professorRoomsArray): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO professor_rooms (ProfessorID, RoomID, academic_period_id) VALUES (:professorID, :roomID, :academicPeriodID)");
        foreach ($professorRoomsArray as $professorRoom) {
            $stmt->execute([
                'professorID' => $ID,
                'roomID' => $professorRoom->getRoomID(),
                'academicPeriodID' => $professorRoom->getAcademicPeriodID()
            ]);
        }
    }

    private function DeleteRoomsProfessor(string $ID, array $professorRoomsArray): void
    {
        $stmt = $this->pdo->prepare("DELETE FROM professor_rooms WHERE ProfessorID = :professorID AND academic_period_id = :academicPeriodID");
        $stmt->execute(['professorID' => $ID, 'academicPeriodID' => $professorRoomsArray[0]->getAcademicPeriodID()]);
    }

    private function AddAvailabilityProfessor(string $ID, array $professorAvailabilityArray): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO professor_availability (ProfessorID, DayID, academic_period_id, StartTime, EndTime) VALUES (:professorID, :dayID, :academicPeriodID, :startTime, :endTime)");
        foreach ($professorAvailabilityArray as $professorAvailability) {
            $stmt->execute([
                'professorID' => $ID,
                'dayID' => $professorAvailability->getDayID(),
                'academicPeriodID' => $professorAvailability->getAcademicPeriodID(),
                'startTime' => $professorAvailability->getStartTime(),
                'endTime' => $professorAvailability->getEndTime()
            ]);
        }
    }

    private function DeleteAvailabilityProfessor(string $ID, array $professorAvailabilityArray): void
    {
        $stmt = $this->pdo->prepare("DELETE FROM professor_availability WHERE ProfessorID = :professorID AND academic_period_id = :academicPeriodID");
        $stmt->execute(['professorID' => $ID, 'academicPeriodID' => $professorAvailabilityArray[0]->getAcademicPeriodID()]);
    }

    private function AddContractProfessor(string $ID, ProfessorContracts $professorContract): void
    {
        $stmt = $this->pdo->prepare("INSERT INTO professor_contracts (professor_id, academic_period_id, with_contract, Hours) VALUES (:professor_id, :academicPeriodID, :with_contract, :hours)");
        $stmt->execute([
            'professor_id' => $ID,
            'academicPeriodID' => $professorContract->getAcademicPeriodID(),
            'with_contract' => $professorContract->getWithContract() ? 1 : 0,
            'hours' => $professorContract->getWithContract() ? $professorContract->getHours() : 0
        ]);
    }

    private function DeleteContractProfessor(string $ID, ProfessorContracts $professorContract): void
    {
        $stmt = $this->pdo->prepare("DELETE FROM professor_contracts WHERE professor_id = :professorID AND academic_period_id = :academicPeriodID");
        $stmt->execute([
            'professorID' => $ID,
            'academicPeriodID' => $professorContract->getAcademicPeriodID()
        ]); 
    }

    public function assignProfessor(string $ID, array $professorInstrumentsArray, array $professorRoomsArray, array $professorAvailabilityArray, ?ProfessorContracts $professorContract = null): void
    {
        try {
            $this->pdo->beginTransaction();
            $this->DeleteInstrumentsProfessor($ID, $professorInstrumentsArray);
            $this->AddInstrumentsProfessor($ID, $professorInstrumentsArray);
            $this->DeleteRoomsProfessor($ID, $professorRoomsArray);
            $this->AddRoomsProfessor($ID, $professorRoomsArray);
            $this->DeleteAvailabilityProfessor($ID, $professorAvailabilityArray);
            $this->AddAvailabilityProfessor($ID, $professorAvailabilityArray);
            $this->DeleteContractProfessor($ID, $professorContract);
            $this->AddContractProfessor($ID, $professorContract);
            $this->pdo->commit();
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function getProfessorsWithAssign(int $academicPeriodID, int $limit, int $offset, string $orderDir, string $query = '', bool $offPagination = false, bool $onlyWithAssignments = false): array 
    {
        $searchQuery = "%$query%";
        
        $whereClause = 'p.ProfessorIsDelete = 0 AND (:query = "" OR 
            p.ProfessorID LIKE :query OR 
            p.ProfessorFirstName LIKE :query OR 
            p.ProfessorLastName LIKE :query OR 
            p.ProfessorPhone LIKE :query OR 
            p.ProfessorStatus = :queryStatus OR 
            u.UserEmail LIKE :query)';
        
        if($onlyWithAssignments){
            $whereClause .= ' AND (pc.professor_id IS NOT NULL)';
        }
        
        // Obtener cantidad total de registros
        $countStmt = $this->pdo->prepare("SELECT COUNT(DISTINCT p.ProfessorID) as total FROM professors p 
            LEFT JOIN users u ON p.ProfessorID = u.userID 
            LEFT JOIN professor_contracts pc ON p.ProfessorID = pc.professor_id AND pc.academic_period_id = :academicPeriodID
            WHERE $whereClause");
        
        $countStmt->bindValue(':query', $searchQuery, PDO::PARAM_STR);
        $countStmt->bindValue(':queryStatus', $query, PDO::PARAM_STR);
        $countStmt->bindParam(':academicPeriodID', $academicPeriodID, PDO::PARAM_INT);
        $countStmt->execute();
        $totalRecords = (int) $countStmt->fetchColumn();
        $totalPages = $limit > 0 ? ceil($totalRecords / $limit) : 1;
        
        // Obtener datos paginados
        $stmt = $this->pdo->prepare(
            "SELECT 
                p.ProfessorID, p.ProfessorFirstName, p.ProfessorLastName, p.ProfessorPhone, p.ProfessorStatus,
                u.UserID, u.UserEmail, u.RoleID,
                COALESCE(JSON_ARRAYAGG(DISTINCT JSON_OBJECT(
                    'AvailabilityID', pa.AvailabilityID,
                    'dayID', pa.DayID,
                    'startTime', pa.StartTime,
                    'endTime', pa.EndTime
                )), '[]') AS availabilities,
                COALESCE(JSON_ARRAYAGG(DISTINCT JSON_OBJECT(
                    'hours', pc.hours,
                    'with_contract', pc.with_contract
                )), '[]') AS contracts,
                COALESCE(JSON_ARRAYAGG(DISTINCT JSON_OBJECT(
                    'InstrumentID', pi.InstrumentID
                )), '[]') AS instruments,
                COALESCE(JSON_ARRAYAGG(DISTINCT JSON_OBJECT(
                    'RoomID', pr.RoomID
                )), '[]') AS rooms
            FROM professors p
            LEFT JOIN users u ON p.ProfessorID = u.userID
            LEFT JOIN professor_availability pa ON p.ProfessorID = pa.ProfessorID AND pa.academic_period_id = :academicPeriodID
            LEFT JOIN professor_contracts pc ON p.ProfessorID = pc.professor_id AND pc.academic_period_id = :academicPeriodID
            LEFT JOIN professor_instruments pi ON p.ProfessorID = pi.ProfessorID AND pi.academic_period_id = :academicPeriodID
            LEFT JOIN professor_rooms pr ON p.ProfessorID = pr.ProfessorID AND pr.academic_period_id = :academicPeriodID
            WHERE $whereClause
            GROUP BY p.ProfessorID
            ORDER BY pc.date_assign $orderDir
            LIMIT :limit OFFSET :offset"
        );
        
        $stmt->bindParam(':academicPeriodID', $academicPeriodID, PDO::PARAM_INT);
        $stmt->bindValue(':query', $searchQuery, PDO::PARAM_STR);
        $stmt->bindValue(':queryStatus', $query, PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $professors = [];
        foreach ($rows as $row) {
            $user = new User(
                $row['UserID'],
                $row['UserEmail'],
                null,
                (int) $row['RoleID']
            );

            $instruments = json_decode($row['instruments'], true);
            $rooms = json_decode($row['rooms'], true);
            $availabilities = json_decode($row['availabilities'], true);
            $contracts = json_decode($row['contracts'], true);
            
            $instruments = array_filter($instruments, fn($i) => !is_null($i['InstrumentID']));
            $rooms = array_filter($rooms, fn($r) => !is_null($r['RoomID']));
            $availabilities = array_filter($availabilities, fn($a) => !is_null($a['AvailabilityID']));
            $contracts = array_filter($contracts, fn($c) => !is_null($c['with_contract']));

            $with_contract = count($contracts) > 0 ? $contracts[0]['with_contract'] : 0;
            $hours = count($contracts) > 0 ? $contracts[0]['hours'] : 0;

            $professors[] = new Professor(
                $row['ProfessorID'],
                $row['ProfessorFirstName'],
                $row['ProfessorLastName'],
                $row['ProfessorPhone'],
                $row['ProfessorStatus'],
                $user,
                $instruments,
                $rooms,
                $availabilities,
                (bool)$with_contract,
                (int)$hours
            );
        }
        
        if ($offPagination) {
            return $professors;
        }
        
        return ['data' => $professors, 'pages' => $totalPages];
    }

}

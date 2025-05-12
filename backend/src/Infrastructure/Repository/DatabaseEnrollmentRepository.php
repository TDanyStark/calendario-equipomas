<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Enrollment\Enrollment;
use App\Domain\Enrollment\EnrollmentRepository;
use App\Infrastructure\Database;
use PDO;
use Exception;
use Monolog\Logger;

class DatabaseEnrollmentRepository implements EnrollmentRepository
{
  private PDO $pdo;

  public function __construct(Database $database)
  {
    $this->pdo = $database->getConnection();
  }

  public function findAll(
    int $limit,
    int $offset,
    string $query,
    string $courseID,
    string $instrumentID,
    string $semesterID,
    int $academic_periodID,
    bool $onlyActive
  ): array {

    $searchQuery = "%$query%";

    if (!$academic_periodID) {
      // Si no hay un período académico activo, retornar vacío o manejar el caso de forma adecuada
      return ['data' => [], 'pages' => 0];
    }

    // Condición WHERE reutilizable
    $whereClause = '(:query = "" OR CONCAT(s.StudentFirstName, " ", s.StudentLastName) LIKE :query 
            OR s.StudentFirstName LIKE :query 
            OR s.StudentLastName LIKE :query 
            OR c.CourseName LIKE :query 
            OR i.InstrumentName LIKE :query
            OR e.StudentID LIKE :query
            OR se.SemesterName LIKE :query
            OR e.Status = :queryClean)';

    // Agregar condiciones adicionales para los filtros
    if (!empty($courseID)) {
      $whereClause .= ' AND e.CourseID = :courseID';
    }
    if (!empty($instrumentID)) {
      $whereClause .= ' AND e.InstrumentID = :instrumentID';
    }
    if (!empty($semesterID)) {
      $whereClause .= ' AND e.SemesterID = :semesterID';
    }
    if ($onlyActive) {
      $whereClause .= ' AND e.Status = "activo"';
    }

    // Filtrar por el período académico activo
    $whereClause .= ' AND e.academic_periodID = :academic_periodID';

    // Obtener cantidad total de registros
    $countStmt = $this->pdo->prepare("SELECT COUNT(*) as total 
            FROM enrollments e
            JOIN students s ON e.StudentID = s.StudentID
            JOIN courses c ON e.CourseID = c.CourseID
            JOIN instruments i ON e.InstrumentID = i.InstrumentID
            JOIN semesters se ON e.SemesterID = se.SemesterID
            WHERE $whereClause");
    $countStmt->bindValue(':query', $searchQuery, PDO::PARAM_STR);
    $countStmt->bindValue(':queryClean', $query, PDO::PARAM_STR);
    $countStmt->bindValue(':academic_periodID', $academic_periodID, PDO::PARAM_INT);

    // Vincular valores de los filtros si no están vacíos
    if (!empty($courseID)) {
      $countStmt->bindValue(':courseID', $courseID, PDO::PARAM_STR);
    }
    if (!empty($instrumentID)) {
      $countStmt->bindValue(':instrumentID', $instrumentID, PDO::PARAM_STR);
    }
    if (!empty($semesterID)) {
      $countStmt->bindValue(':semesterID', $semesterID, PDO::PARAM_STR);
    }

    $countStmt->execute();
    $totalRecords = (int) $countStmt->fetchColumn();

    // Calcular número de páginas
    $totalPages = $limit > 0 ? ceil($totalRecords / $limit) : 1;

    // Obtener datos paginados
    $dataStmt = $this->pdo->prepare("SELECT e.EnrollmentID, e.StudentID, e.CourseID, e.SemesterID, e.InstrumentID, e.academic_periodID, e.Status, 
            s.StudentFirstName, s.StudentLastName, c.CourseName, i.InstrumentName, se.SemesterName, CONCAT(ap.year, ' - ', ap.semester) as academicPeriodName
            FROM enrollments e
            JOIN students s ON e.StudentID = s.StudentID
            JOIN courses c ON e.CourseID = c.CourseID
            JOIN semesters se ON e.SemesterID = se.SemesterID
            JOIN instruments i ON e.InstrumentID = i.InstrumentID
            JOIN academic_periods ap ON e.academic_periodID = ap.id
            WHERE $whereClause
            ORDER BY e.Updated_at DESC, e.Created_at DESC, e.EnrollmentID ASC
            LIMIT :limit OFFSET :offset");

    $dataStmt->bindValue(':query', $searchQuery, PDO::PARAM_STR);
    $dataStmt->bindValue(':queryClean', $query, PDO::PARAM_STR);
    $dataStmt->bindValue(':academic_periodID', $academic_periodID, PDO::PARAM_INT);

    // Vincular valores de los filtros si no están vacíos
    if (!empty($courseID)) {
      $dataStmt->bindValue(':courseID', $courseID, PDO::PARAM_STR);
    }
    if (!empty($instrumentID)) {
      $dataStmt->bindValue(':instrumentID', $instrumentID, PDO::PARAM_STR);
    }
    if (!empty($semesterID)) {
      $dataStmt->bindValue(':semesterID', $semesterID, PDO::PARAM_STR);
    }

    $dataStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $dataStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $dataStmt->execute();

    $enrollments = [];

    while ($row = $dataStmt->fetch(PDO::FETCH_ASSOC)) {
      $enrollments[] = new Enrollment(
        (string)$row['EnrollmentID'],
        (string)$row['StudentID'],
        (string)$row['CourseID'],
        (string)$row['SemesterID'],
        (string)$row['InstrumentID'],
        (int)$row['academic_periodID'],
        $row['Status'],
        $row['StudentFirstName'] . ' ' . $row['StudentLastName'],
        $row['CourseName'],
        $row['SemesterName'],
        $row['InstrumentName'],
        $row['academicPeriodName']
      );
    }

    return ['data' => $enrollments, 'pages' => $totalPages];
  }


  public function findById(int $id): ?Enrollment
  {
    $stmt = $this->pdo->prepare("SELECT * FROM enrollments WHERE EnrollmentID = :id");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
      return null;
    }

    return new Enrollment(
      $row['EnrollmentID'],
      $row['StudentID'],
      $row['CourseID'],
      $row['SemesterID'],
      $row['InstrumentID'],
      $row['academic_periodID'],
      $row['Status'],
      null,
      null,
      null,
      null,
      null,
    );
  }

  public function create(Enrollment $enrollment): int
  {
    try {
      // empzar transaccion
      $this->pdo->beginTransaction();
      // obtener el periodo academico activo

      $stmt = $this->pdo->prepare("INSERT INTO enrollments (StudentID, CourseID, SemesterID, InstrumentID, academic_periodID, Status) 
      VALUES (:studentID, :courseID, :semesterID, :instrumentID, :academic_periodID, :status)");

      $stmt->bindValue(':studentID', $enrollment->getStudentID(), PDO::PARAM_STR);
      $stmt->bindValue(':courseID', $enrollment->getCourseID(), PDO::PARAM_INT);
      $stmt->bindValue(':semesterID', $enrollment->getSemesterID(), PDO::PARAM_INT);
      $stmt->bindValue(':instrumentID', $enrollment->getInstrumentID(), PDO::PARAM_INT);
      $stmt->bindValue(':academic_periodID', $enrollment->getAcademicPeriodID(), PDO::PARAM_INT);
      $stmt->bindValue(':status', $enrollment->getStatus(), PDO::PARAM_STR);

      if ($stmt->execute()) {
        $this->pdo->commit();
        return (int) $this->pdo->lastInsertId();
      }
      return 0;
    } catch (Exception $e) {
      throw new Exception("Error al obtener el período académico activo");
      return 0;
    }
  }

  public function update(Enrollment $enrollment): bool
  {
    $stmt = $this->pdo->prepare("UPDATE enrollments 
            SET CourseID = :courseID, SemesterID = :semesterID, InstrumentID = :instrumentID, Status = :status 
            WHERE EnrollmentID = :id");

    $stmt->bindValue(':id', $enrollment->getEnrollmentID(), PDO::PARAM_INT);
    $stmt->bindValue(':courseID', $enrollment->getCourseID(), PDO::PARAM_INT);
    $stmt->bindValue(':semesterID', $enrollment->getSemesterID(), PDO::PARAM_INT);
    $stmt->bindValue(':instrumentID', $enrollment->getInstrumentID(), PDO::PARAM_INT);
    $stmt->bindValue(':status', $enrollment->getStatus(), PDO::PARAM_STR);

    return $stmt->execute();
  }

  public function delete(int $id): bool
  {
    $stmt = $this->pdo->prepare("DELETE FROM enrollments WHERE EnrollmentID = :id");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);

    return $stmt->execute();
  }

  public function deleteMultiple(array $ids): int
  {
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $stmt = $this->pdo->prepare("DELETE FROM enrollments WHERE EnrollmentID IN ($placeholders)");

    foreach ($ids as $index => $id) {
      $stmt->bindValue($index + 1, $id, PDO::PARAM_INT);
    }

    $stmt->execute();
    return $stmt->rowCount();
  }

  public function updateByGroup(string $changeTo, string $query, string $courseID, string $instrumentID, string $semesterID): int
  {
    // Validamos que $changeTo solo tenga valores permitidos
    if (!in_array($changeTo, ['activo', 'inactivo'], true)) {
      return 0;
    }

    // Construcción de la cláusula WHERE dinámica
    $whereClause = '(:query = "" OR CONCAT(s.StudentFirstName, " ", s.StudentLastName) LIKE :query 
        OR s.StudentFirstName LIKE :query 
        OR s.StudentLastName LIKE :query 
        OR c.CourseName LIKE :query 
        OR i.InstrumentName LIKE :query
        OR e.StudentID LIKE :query
        OR e.Status = :queryClean)';

    // Construcción dinámica de la consulta con JOINs
    $sqlQuery = "
          UPDATE enrollments e
          JOIN students s ON e.StudentID = s.StudentID
          JOIN courses c ON e.CourseID = c.CourseID
          JOIN instruments i ON e.InstrumentID = i.InstrumentID
          JOIN semesters se ON e.SemesterID = se.SemesterID
          SET e.Status = :status
          WHERE e.Status != 'withSchedule'
            AND (
                (:status = 'inactivo' AND e.Status = 'activo') 
             OR (:status = 'activo' AND e.Status = 'inactivo')
            )";

    // Parámetros iniciales
    $params = [':status' => $changeTo];

    // Agregamos condiciones dinámicamente solo si tienen valor
    if (!empty($courseID)) {
      $sqlQuery .= " AND e.CourseID = :courseID";
      $params[':courseID'] = $courseID;
    }
    if (!empty($instrumentID)) {
      $sqlQuery .= " AND e.InstrumentID = :instrumentID";
      $params[':instrumentID'] = $instrumentID;
    }
    if (!empty($semesterID)) {
      $sqlQuery .= " AND e.SemesterID = :semesterID";
      $params[':semesterID'] = $semesterID;
    }

    // Agregamos la cláusula WHERE de búsqueda
    $sqlQuery .= " AND " . $whereClause;
    $params[':query'] = "%$query%";  // Agregamos comodines para LIKE
    $params[':queryClean'] = $query; // Para comparaciones exactas

    // Preparar y ejecutar consulta
    $stmt = $this->pdo->prepare($sqlQuery);

    // Asignar valores dinámicos
    foreach ($params as $key => $value) {
      $stmt->bindValue($key, $value, PDO::PARAM_STR);
    }

    $stmt->execute();
    return $stmt->rowCount(); // Devuelve el número de filas afectadas
  }

  public function findEnrollmentIdsActive(int $academic_periodID): array
  {
    $stmt = $this->pdo->prepare("SELECT EnrollmentID FROM enrollments WHERE academic_periodID = :academic_periodID");
    $stmt->bindValue(':academic_periodID', $academic_periodID, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_COLUMN);
  }

  public function countByAcademicPeriodId(int $academic_periodID): int
  {
    $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM enrollments WHERE academic_periodID = :academic_periodID");
    $stmt->bindValue(':academic_periodID', $academic_periodID, PDO::PARAM_INT);
    $stmt->execute();
    return (int) $stmt->fetchColumn();
  }
}

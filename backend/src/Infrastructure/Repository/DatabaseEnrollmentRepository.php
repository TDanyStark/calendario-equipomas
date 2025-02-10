<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Enrollment\Enrollment;
use App\Domain\Enrollment\EnrollmentRepository;
use App\Infrastructure\Database;
use PDO;
use Exception;

class DatabaseEnrollmentRepository implements EnrollmentRepository
{
  private PDO $pdo;

  public function __construct(Database $database)
  {
    $this->pdo = $database->getConnection();
  }

  public function findAll(int $limit, int $offset, string $query): array
  {
    $searchQuery = "%$query%";

    // Condición WHERE reutilizable
    $whereClause = '(:query = "" OR CONCAT(s.StudentFirstName, " ", s.StudentLastName) LIKE :query 
            OR s.StudentFirstName LIKE :query 
            OR s.StudentLastName LIKE :query 
            OR c.CourseName LIKE :query 
            OR i.InstrumentName LIKE :query
            OR e.StudentID LIKE :query
            OR e.Status LIKE :query)';

    // Obtener cantidad total de registros
    $countStmt = $this->pdo->prepare("SELECT COUNT(*) as total 
            FROM enrollments e
            JOIN students s ON e.StudentID = s.StudentID
            JOIN courses c ON e.CourseID = c.CourseID
            JOIN instruments i ON e.InstrumentID = i.InstrumentID
            WHERE $whereClause");
    $countStmt->bindValue(':query', $searchQuery, PDO::PARAM_STR);
    $countStmt->execute();
    $totalRecords = (int) $countStmt->fetchColumn();

    // Calcular número de páginas
    $totalPages = $limit > 0 ? ceil($totalRecords / $limit) : 1;

    // Obtener datos paginados
    $dataStmt = $this->pdo->prepare("SELECT e.EnrollmentID, e.StudentID, e.CourseID, e.SemesterID, e.InstrumentID, e.Status, 
            s.StudentFirstName, s.StudentLastName, c.CourseName, i.InstrumentName, se.SemesterName
            FROM enrollments e
            JOIN students s ON e.StudentID = s.StudentID
            JOIN courses c ON e.CourseID = c.CourseID
            JOIN semesters se ON e.SemesterID = se.SemesterID
            JOIN instruments i ON e.InstrumentID = i.InstrumentID
            WHERE $whereClause
            ORDER BY e.Updated_at DESC
            LIMIT :limit OFFSET :offset");

    $dataStmt->bindValue(':query', $searchQuery, PDO::PARAM_STR);
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
        $row['Status'],
        $row['StudentFirstName'] . ' ' . $row['StudentLastName'],
        $row['CourseName'],
        $row['SemesterName'],
        $row['InstrumentName']
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
      $row['Status'],
      null,
      null,
      null,
      null,
    );
  }

  public function create(Enrollment $enrollment): int
  {
    $stmt = $this->pdo->prepare("INSERT INTO enrollments (StudentID, CourseID, SemesterID, InstrumentID, Status) 
            VALUES (:studentID, :courseID, :semesterID, :instrumentID, :status)");

    $stmt->bindValue(':studentID', $enrollment->getStudentID(), PDO::PARAM_STR);
    $stmt->bindValue(':courseID', $enrollment->getCourseID(), PDO::PARAM_INT);
    $stmt->bindValue(':semesterID', $enrollment->getSemesterID(), PDO::PARAM_INT);
    $stmt->bindValue(':instrumentID', $enrollment->getInstrumentID(), PDO::PARAM_INT);
    $stmt->bindValue(':status', $enrollment->getStatus(), PDO::PARAM_STR);

    if ($stmt->execute()) {
      return (int) $this->pdo->lastInsertId();
    }

    throw new Exception("Error al crear la inscripción");
  }

  public function update(Enrollment $enrollment): bool
  {
    $stmt = $this->pdo->prepare("UPDATE enrollments 
            SET StudentID = :studentID, CourseID = :courseID, SemesterID = :semesterID, InstrumentID = :instrumentID, Status = :status 
            WHERE EnrollmentID = :id");

    $stmt->bindValue(':id', $enrollment->getEnrollmentID(), PDO::PARAM_INT);
    $stmt->bindValue(':studentID', $enrollment->getStudentID(), PDO::PARAM_STR);
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
}

<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\GroupClass\GroupClass;
use App\Domain\GroupClass\GroupClassRepository;
use PDO;
use App\Infrastructure\Database;

class DatabaseGroupClassRepository implements GroupClassRepository
{
  private PDO $pdo;
  private string $table = 'group_classes';

  public function __construct(Database $database)
  {
    $this->pdo = $database->getConnection();
  }
  
  public function findAll(int $limit = 10, int $offset = 0, string $query = '', string $courseId = '', string $instrumentId = '', string $semesterId = '', string $professorId = '', string $studentId = '', int $academicPeriodId = 0): array
  {
    // Si no hay un período académico activo, retornar vacío
    if (!$academicPeriodId) {
      return ['data' => [], 'pages' => 0];
    }
    
    $searchQuery = "%$query%";
    
    // Condición WHERE reutilizable
    $whereClause = '(gc.academic_period_id = :academic_period_id)';
    $params = [
      ':academic_period_id' => $academicPeriodId
    ];
    
    // Filtro por búsqueda de texto
    if (!empty($query)) {
      $whereClause .= ' AND (gc.name LIKE :query OR p.firstName LIKE :query OR p.lastName LIKE :query)';
      $params[':query'] = $searchQuery;
    }
    
    // Filtro por curso
    if (!empty($courseId)) {
      $whereClause .= ' AND e.CourseID = :course_id';
      $params[':course_id'] = $courseId;
    }
    
    // Filtro por instrumento
    if (!empty($instrumentId)) {
      $whereClause .= ' AND e.InstrumentID = :instrument_id';
      $params[':instrument_id'] = $instrumentId;
    }
    
    // Filtro por semestre
    if (!empty($semesterId)) {
      $whereClause .= ' AND e.semester_id = :semester_id';
      $params[':semester_id'] = $semesterId;
    }
    
    // Filtro por profesor
    if (!empty($professorId)) {
      $whereClause .= ' AND gcp.professor_id = :professor_id';
      $params[':professor_id'] = $professorId;
    }
    
    // Filtro por estudiante (a través de las inscripciones)
    if (!empty($studentId)) {
      $whereClause .= ' AND e.StudentID = :student_id';
      $params[':student_id'] = $studentId;
    }

    // Obtener cantidad total de registros
    $countSql = "
      SELECT COUNT(DISTINCT gc.id) as total 
      FROM {$this->table} gc
      LEFT JOIN group_class_enrollments gce ON gc.id = gce.group_class_id
      LEFT JOIN group_class_professors gcp ON gc.id = gcp.group_class_id
      LEFT JOIN enrollments e ON gce.enrollment_id  = e.EnrollmentID
      LEFT JOIN professors p ON gcp.professor_id = p.ProfessorID
      LEFT JOIN courses c ON e.CourseID = c.CourseID
      LEFT JOIN instruments i ON e.InstrumentID = i.InstrumentID
      LEFT JOIN semesters s ON e.SemesterID = s.SemesterID
      WHERE {$whereClause}
    ";
    
    $countStmt = $this->pdo->prepare($countSql);
    
    // Vincular valores de los parámetros
    foreach ($params as $key => $value) {
      $countStmt->bindValue($key, $value);
    }
    
    $countStmt->execute();
    $totalRecords = (int) $countStmt->fetchColumn();
    
    // Calcular número de páginas
    $totalPages = $limit > 0 ? ceil($totalRecords / $limit) : 1;
    
    // Obtener datos paginados con toda la información necesaria
    $dataSql = "
      SELECT DISTINCT gc.* 
      FROM {$this->table} gc
      LEFT JOIN group_class_enrollments gce ON gc.id = gce.group_class_id
      LEFT JOIN group_class_professors gcp ON gc.id = gcp.group_class_id
      LEFT JOIN enrollments e ON gce.enrollment_id = e.EnrollmentID
      LEFT JOIN professors p ON gcp.professor_id = p.ProfessorID
      LEFT JOIN courses c ON e.CourseID = c.CourseID
      LEFT JOIN instruments i ON e.InstrumentID = i.InstrumentID
      LEFT JOIN semesters s ON e.SemesterID = s.SemesterID
      WHERE {$whereClause}
      ORDER BY gc.name ASC
      LIMIT :limit OFFSET :offset
    ";
    
    $dataStmt = $this->pdo->prepare($dataSql);
    
    // Vincular valores de los parámetros
    foreach ($params as $key => $value) {
      $dataStmt->bindValue($key, $value);
    }
    
    $dataStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $dataStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $dataStmt->execute();
    
    $results = $dataStmt->fetchAll(PDO::FETCH_ASSOC);
    
    $groupClasses = array_map(function ($result) {
      return new GroupClass(
        $result['id'],
        $result['name'],
        $result['room_id'],
        $result['academic_period_id'],
        $result['day_id'],
        $result['start_time'],
        $result['end_time']
      );
    }, $results);
    
    return [
      'data' => $groupClasses,
      'pages' => $totalPages
    ];
  }

  public function findAvailabilityByRoom(int $roomId, int $academicPeriodId): array
  {
    $stmt = $this->pdo->prepare("
        SELECT * FROM {$this->table} 
        WHERE room_id = :room_id
        AND academic_period_id = :academic_period_id
        ORDER BY name ASC
    ");

    $stmt->execute([
      'room_id' => $roomId,
      'academic_period_id' => $academicPeriodId
    ]);

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return array_map(function ($result) {
      return new GroupClass(
        $result['id'],
        $result['name'],
        $result['room_id'],
        $result['academic_period_id'],
        $result['day_id'],
        $result['start_time'],
        $result['end_time']
      );
    }, $results);
  }

  public function create(GroupClass $groupClass): int
  {
    try {
      $this->pdo->beginTransaction();

      // Insert into group_classes table
      $stmt = $this->pdo->prepare("INSERT INTO {$this->table} (name, room_id, academic_period_id, day_id, start_time, end_time) 
        VALUES (:name, :room_id, :academic_period_id, :day_id, :start_time, :end_time)");

      $stmt->execute([
        'name' => $groupClass->getName(),
        'room_id' => $groupClass->getRoomId(),
        'academic_period_id' => $groupClass->getAcademicPeriodId(),
        'day_id' => $groupClass->getDayId(),
        'start_time' => $groupClass->getStartTime(),
        'end_time' => $groupClass->getEndTime()
      ]);

      $groupClassId = (int)$this->pdo->lastInsertId();

      // Insert into group_class_enrollments table
      $enrollments = $groupClass->getEnrollments();
      if ($enrollments) {
        $stmtEnrollments = $this->pdo->prepare("INSERT INTO group_class_enrollments (group_class_id, enrollment_id) VALUES (:group_class_id, :enrollment_id)");
        foreach ($enrollments as $enrollmentId) {
          $stmtEnrollments->execute([
            'group_class_id' => $groupClassId,
            'enrollment_id' => $enrollmentId
          ]);
        }
      }

      // Insert into group_class_professors table
      $professors = $groupClass->getProfessors();
      if ($professors) {
        $stmtProfessors = $this->pdo->prepare("INSERT INTO group_class_professors (group_class_id, professor_id) VALUES (:group_class_id, :professor_id)");
        foreach ($professors as $professorId) {
          $stmtProfessors->execute([
            'group_class_id' => $groupClassId,
            'professor_id' => $professorId
          ]);
        }
      }

      $this->pdo->commit();
      return $groupClassId;
    } catch (\Exception $e) {
      $this->pdo->rollBack();
      throw $e;
    }
  }

}

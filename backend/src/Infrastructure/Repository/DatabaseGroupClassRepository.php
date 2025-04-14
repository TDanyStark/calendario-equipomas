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
  public function findAll(): array
  {
    $stmt = $this->pdo->query("
        SELECT * FROM {$this->table} 
        ORDER BY name ASC
    ");

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

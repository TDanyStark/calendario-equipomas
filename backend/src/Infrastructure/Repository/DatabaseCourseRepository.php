<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Course\Course;
use App\Domain\Course\CourseRepository;
use App\Infrastructure\Database;
use PDO;
use App\Domain\Course\CourseAvailability;

use App\Domain\Shared\Days\DayOfWeek;

class DatabaseCourseRepository implements CourseRepository
{
  private PDO $pdo;

  public function __construct(Database $database)
  {
    $this->pdo = $database->getConnection();
  }

  public function findAll(): array
  {
    $stmt = $this->pdo->query("SELECT * FROM courses");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return array_map(fn($row) => $this->mapRowToCourse($row), $results);
  }

  public function findById(int $id): ?Course
  {
    $stmt = $this->pdo->prepare("SELECT * FROM courses WHERE CourseID = :id");
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return $row ? $this->mapRowToCourse($row) : null;
  }

  private function getCourseAvailability(int $courseId): array
  {
    $stmt = $this->pdo->prepare("SELECT DayOfWeek, StartTime, EndTime FROM course_availability WHERE CourseID = :courseId");
    $stmt->execute(['courseId' => $courseId]);
    $availabilityData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return array_map(
      fn($availability) => new CourseAvailability(
        DayOfWeek::from(strtolower($availability['DayOfWeek'])), // Convertimos el valor a enum
        $availability['StartTime'],
        $availability['EndTime']
      ),
      $availabilityData
    );
  }


  public function create(Course $course): int
  {
    $stmt = $this->pdo->prepare("INSERT INTO courses (CourseName, IsOnline) VALUES (:name, :isOnline)");
    $stmt->execute([
      'name' => $course->getName(),
      'isOnline' => $course->getIsOnline(),
    ]);

    return (int)$this->pdo->lastInsertId();
  }

  public function update(Course $course): void
  {
    $stmt = $this->pdo->prepare("UPDATE courses SET CourseName = :name, IsOnline = :isOnline WHERE CourseID = :id");
    $stmt->execute([
      'id' => $course->getId(),
      'name' => $course->getName(),
      'isOnline' => $course->getIsOnline(),
    ]);
  }

  public function delete(int $id): void
  {
    $stmt = $this->pdo->prepare("DELETE FROM courses WHERE CourseID = :id");
    $stmt->execute(['id' => $id]);
  }

  private function mapRowToCourse(array $row): Course
  {
    $availability = $this->getCourseAvailability((int)$row['CourseID']);

    return new Course(
      (string)$row['CourseID'],
      $row['CourseName'],
      (bool)$row['IsOnline'],
      (int)$row['CourseDuration'],
      $row['Created_at'],
      $row['Updated_at'],
      $availability
    );
  }
}

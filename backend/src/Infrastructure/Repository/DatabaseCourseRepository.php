<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Course\Course;
use App\Domain\Course\CourseRepository;
use App\Infrastructure\Database;
use PDO;
use App\Domain\Course\CourseAvailability;
use App\Domain\Shared\Days\ScheduleDay;
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
      // Consulta JOIN entre `course_availability` y `schedule_days` para obtener todos los datos necesarios de cada día
      $stmt = $this->pdo->prepare("
          SELECT 
              ca.DayID,
              sd.DayName,
              sd.DayDisplayName,
              sd.IsActive,
              sd.StartTime AS ScheduleStartTime,
              sd.EndTime AS ScheduleEndTime,
              ca.StartTime,
              ca.EndTime
          FROM course_availability ca
          JOIN schedule_days sd ON ca.DayID = sd.DayID
          WHERE ca.CourseID = :courseId
      ");
      
      $stmt->execute(['courseId' => $courseId]);
      $availabilityData = $stmt->fetchAll(PDO::FETCH_ASSOC);
  
      // Mapeo de los resultados para construir instancias de `CourseAvailability` con un objeto `ScheduleDay`
      return array_map(
          fn($availability) => new CourseAvailability(
              (string)$availability['DayID'],
              new ScheduleDay(                                         // Creamos una instancia de `ScheduleDay`
                  (string)$availability['DayID'],
                  DayOfWeek::from($availability['DayName']),
                  $availability['DayDisplayName'],
                  (bool)$availability['IsActive'],
                  $availability['ScheduleStartTime'],
                  $availability['ScheduleEndTime']
              ),
              $availability['StartTime'],                             // Hora de inicio específica para la disponibilidad del curso
              $availability['EndTime']                                // Hora de finalización específica para la disponibilidad del curso
          ),
          $availabilityData
      );
  }
  
  


  public function create(Course $course): int
  {
    $stmt = $this->pdo->prepare("INSERT INTO courses (CourseName, IsOnline, CourseDuration) VALUES (:name, :isOnline, :duration)");
    $stmt->execute([
      'name' => $course->getName(),
      'isOnline' => $course->getIsOnline(),
      'duration' => $course->getDuration(),
    ]);

    $idInserted = (int)$this->pdo->lastInsertId();

    foreach ($course->getAvailability() as $availability) {
      $this->createAvailability($availability, $idInserted);
    }

    return $idInserted;
  }

  public function createAvailability(CourseAvailability $availability, int $courseId): void
  {
    $stmt = $this->pdo->prepare("INSERT INTO course_availability (CourseID, DayID, StartTime, EndTime) VALUES (:courseId, :dayId, :startTime, :endTime)");
    $stmt->execute([
      'courseId' => $courseId,
      'dayId' => $availability->getScheduleDay()->getDayId(),
      'startTime' => $availability->getStartTime(),
      'endTime' => $availability->getEndTime(),
    ]);
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

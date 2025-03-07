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

}

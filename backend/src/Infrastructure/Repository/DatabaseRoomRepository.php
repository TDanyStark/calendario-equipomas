<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Room\Room;
use App\Domain\Room\RoomRepository;
use PDO;
use App\Infrastructure\Database;

class DatabaseRoomRepository implements RoomRepository
{
  private PDO $pdo;

  public function __construct(Database $database)
  {
    $this->pdo = $database->getConnection();
  }

  public function findAll(): array
  {
    $stmt = $this->pdo->query("SELECT * FROM rooms");
    $rooms = [];
    while ($row = $stmt->fetch()) {
      $rooms[] = new Room((int)$row['RoomID'], $row['RoomName'], (int)$row['RoomCapacity'], $row['Created_at'], $row['Updated_at']);
    }
    return $rooms;
  }

  public function findById(int $id): ?Room
  {
    $stmt = $this->pdo->prepare("SELECT * FROM rooms WHERE RoomID = :id");
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();

    return $row ? new Room((int)$row['RoomID'], $row['RoomName'], (int)$row['RoomCapacity'], $row['Created_at'], $row['Updated_at']) : null;
  }

  public function create(Room $room): int
  {
    $stmt = $this->pdo->prepare("INSERT INTO rooms (RoomName, RoomCapacity) VALUES (:name, :capacity)");
    $stmt->execute([
      'name' => $room->getName(),
      'capacity' => $room->getCapacity()
    ]);

    return (int)$this->pdo->lastInsertId();
  }

  public function update(Room $room): bool
  {
    $stmt = $this->pdo->prepare("UPDATE rooms SET RoomName = :name, RoomCapacity = :capacity WHERE RoomID = :id");
    return $stmt->execute([
      'name' => $room->getName(),
      'capacity' => $room->getCapacity(),
      'id' => $room->getId()
    ]);
  }

  public function delete(int $id): bool
  {
    $stmt = $this->pdo->prepare("DELETE FROM rooms WHERE RoomID = :id");
    return $stmt->execute(['id' => $id]);
  }
}

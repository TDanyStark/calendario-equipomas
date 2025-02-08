<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Semester\Semester;
use App\Domain\Semester\SemesterRepository;
use PDO;
use App\Infrastructure\Database;
use StellarWP\Learndash\StellarWP\Arrays\Arr;

class DatabaseSemesterRepository implements SemesterRepository
{
  private PDO $pdo;

  public function __construct(Database $database)
  {
    $this->pdo = $database->getConnection();
  }

  public function findAll(): array
  {
    $stmt = $this->pdo->query("SELECT * FROM semesters");
    $semesters = [];
    while ($row = $stmt->fetch()) {
      $semesters[] = new Semester((string)$row['SemesterID'], $row['SemesterName'], $row['Created_at'], $row['Updated_at']);
    }
    return $semesters;
  }

  public function findById(int $id): ?Semester
  {
    $stmt = $this->pdo->prepare("SELECT * FROM semesters WHERE SemesterID = :id");
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();

    return $row ? new Semester((string)$row['SemesterID'], $row['SemesterName'], $row['Created_at'], $row['Updated_at']) : null;
  }

  public function create(Semester $semester): int
  {
    $stmt = $this->pdo->prepare("INSERT INTO semesters (SemesterName) VALUES (:name)");
    $stmt->execute([
      'name' => $semester->getName(),
    ]);

    return (int)$this->pdo->lastInsertId();
  }

  public function update(Semester $semester): bool
  {
    $stmt = $this->pdo->prepare("UPDATE semesters SET SemesterName = :name WHERE SemesterID = :id");
    return $stmt->execute([
      'name' => $semester->getName(),
      'id' => $semester->getId()
    ]);
  }

  public function delete(int $id): bool
  {
    $stmt = $this->pdo->prepare("DELETE FROM semesters WHERE SemesterID = :id");
    return $stmt->execute(['id' => $id]);
  }

  public function deleteMultiple(array $ids): int
  {
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $query = "DELETE FROM semesters WHERE SemesterID IN ($placeholders)";
    $stmt = $this->pdo->prepare($query);

    $stmt->execute($ids);

    return $stmt->rowCount();
  }

  public function findSemesterByQuery(string $query): array
  {
    $searchQuery = "%$query%";
    $stmt = $this->pdo->prepare('
            SELECT * FROM semesters 
            WHERE SemesterName LIKE :query
            ORDER BY SemesterName ASC
        ');
    $stmt->bindParam(':query', $searchQuery, PDO::PARAM_STR);
    $stmt->execute();

    $semesters = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      $semesters[] = Array(
        'id' => $row['SemesterID'],
        'name' => $row['SemesterName'],
      );
    }

    return $semesters;
  }
}

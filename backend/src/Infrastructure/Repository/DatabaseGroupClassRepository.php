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

   
}

}

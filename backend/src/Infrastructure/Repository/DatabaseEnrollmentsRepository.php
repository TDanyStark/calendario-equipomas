<?php


declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Enrollments\EnrollmentsRepository;
use App\Infrastructure\Database;
use PDO;


class DatabaseEnrollmentsRepository implements EnrollmentsRepository
{
  private PDO $pdo;

  public function __construct(Database $database)
  {
    // Obtiene la conexión desde la clase Database
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
    OR i.InstrumentName LIKE :query)';


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
    $dataStmt = $this->pdo->prepare("SELECT s.StudentFirstName, s.StudentLastName, 
    c.CourseName, i.InstrumentName
    FROM enrollments e
    JOIN students s ON e.StudentID = s.StudentID
    JOIN courses c ON e.CourseID = c.CourseID
    JOIN instruments i ON e.InstrumentID = i.InstrumentID
    WHERE $whereClause
    ORDER BY s.Update_at DESC
    LIMIT :limit OFFSET :offset");

    $dataStmt->bindValue(':query', $searchQuery, PDO::PARAM_STR);
    $dataStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $dataStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $dataStmt->execute();

    $enrollments = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

    return ['data' => $enrollments, 'pages' => $totalPages];
  }
}

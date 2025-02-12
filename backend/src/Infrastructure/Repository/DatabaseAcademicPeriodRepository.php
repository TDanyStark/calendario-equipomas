<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\AcademicPeriod\AcademicPeriod;
use App\Domain\AcademicPeriod\AcademicPeriodRepository;
use PDO;
use App\Infrastructure\Database;

class DatabaseAcademicPeriodRepository implements AcademicPeriodRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
      $this->pdo = $database->getConnection();
  }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM academic_periods');
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return array_map(fn($row) => new AcademicPeriod(
            (string)$row['id'],
            (int) $row['year'],
            (int) $row['semester'],
            $row['startDate'],
            $row['endDate']
        ), $results);
    }

    public function findById(string $id): ?AcademicPeriod
    {
        $stmt = $this->pdo->prepare('SELECT * FROM academic_periods WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$row) {
            return null;
        }
        
        return new AcademicPeriod(
            (string)$row['id'],
            (int) $row['year'],
            (int) $row['semester'],
            $row['startDate'],
            $row['endDate']
        );
    }

    public function create(AcademicPeriod $academicPeriod): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO academic_periods (id, year, semester, startDate, endDate) VALUES (:id, :year, :semester, :startDate, :endDate)'
        );
        $stmt->execute([
            'id' => $academicPeriod->getId(),
            'year' => $academicPeriod->getYear(),
            'semester' => $academicPeriod->getSemester(),
            'startDate' => $academicPeriod->getStartDate(),
            'endDate' => $academicPeriod->getEndDate()
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function update(AcademicPeriod $academicPeriod): bool
    {
        $stmt = $this->pdo->prepare(
            'UPDATE academic_periods SET year = :year, semester = :semester, startDate = :startDate, endDate = :endDate WHERE id = :id'
        );
        return $stmt->execute([
            'id' => $academicPeriod->getId(),
            'year' => $academicPeriod->getYear(),
            'semester' => $academicPeriod->getSemester(),
            'startDate' => $academicPeriod->getStartDate(),
            'endDate' => $academicPeriod->getEndDate()
        ]);
    }
}

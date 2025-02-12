<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\AcademicPeriod\AcademicPeriod;
use App\Domain\AcademicPeriod\AcademicPeriodRepository;
use PDO;
use App\Infrastructure\Database;
use Exception;

class DatabaseAcademicPeriodRepository implements AcademicPeriodRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        $this->pdo = $database->getConnection();
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('
            SELECT * FROM academic_periods
            ORDER BY year DESC, semester DESC
            LIMIT 10
        ');
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(fn($row) => new AcademicPeriod(
            (string)$row['id'],
            (int) $row['year'],
            (int) $row['semester'],
            (int) $row['selected'],
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
            (int) $row['selected'],
            $row['startDate'],
            $row['endDate']
        );
    }

    public function create(AcademicPeriod $academicPeriod): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO academic_periods (id, year, semester, selected, startDate, endDate) VALUES (:id, :year, :semester, :selected, :startDate, :endDate)'
        );
        $stmt->execute([
            'id' => $academicPeriod->getId(),
            'year' => $academicPeriod->getYear(),
            'semester' => $academicPeriod->getSemester(),
            'selected' => $academicPeriod->getSelected(),
            'startDate' => $academicPeriod->getStartDate(),
            'endDate' => $academicPeriod->getEndDate()
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function update(AcademicPeriod $academicPeriod): bool
    {
        $stmt = $this->pdo->prepare(
            'UPDATE academic_periods SET year = :year, semester = :semester, selected = :selected, startDate = :startDate, endDate = :endDate WHERE id = :id'
        );
        return $stmt->execute([
            'id' => $academicPeriod->getId(),
            'year' => $academicPeriod->getYear(),
            'semester' => $academicPeriod->getSemester(),
            'selected' => $academicPeriod->getSelected(),
            'startDate' => $academicPeriod->getStartDate(),
            'endDate' => $academicPeriod->getEndDate()
        ]);
    }

    public function changeSelect(int $id): bool
    {
        try {
            $this->pdo->beginTransaction();

            // Primero, deseleccionamos todos los registros
            $stmt = $this->pdo->prepare('UPDATE academic_periods SET selected = 0 WHERE selected = 1');
            $stmt->execute();


            // Luego, seleccionamos el nuevo registro
            $stmt = $this->pdo->prepare('UPDATE academic_periods SET selected = 1 WHERE id = :id');
            $stmt->execute(['id' => $id]);

            $this->pdo->commit();
            return true;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return false;
        }
    }
}

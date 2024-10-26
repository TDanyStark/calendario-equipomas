<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use App\Domain\Shared\Days\ScheduleDay;
use App\Domain\Shared\Days\DayOfWeek;
use App\Domain\Shared\Days\ScheduleDayRepository;
use App\Infrastructure\Database;
use PDO;

class DbScheduleDayRepository implements ScheduleDayRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        $this->pdo = $database->getConnection();
    }

    /**
     * Obtiene todos los días de la semana con sus horarios.
     *
     * @return ScheduleDay[] Arreglo de objetos ScheduleDay.
     */
    public function findAll(): array
    {
        $stmt = $this->pdo->query("SELECT DayID, DayName, DayDisplayName, StartTime, EndTime FROM schedule_days");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($row) {
            return new ScheduleDay(
                (string)$row['DayID'],
                DayOfWeek::from(strtolower($row['DayName'])), // Convertimos el string a DayOfWeek enum
                $row['DayDisplayName'],
                $row['StartTime'],
                $row['EndTime']
            );
        }, $results);
    }
}

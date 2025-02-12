<?php

declare(strict_types=1);

namespace App\Domain\AcademicPeriod;

use JsonSerializable;

class AcademicPeriod implements JsonSerializable
{
    private string $id;
    private int $year;
    private int $semester;
    private string $startDate;
    private string $endDate;

    public function __construct(
        string $id,
        int $year,
        int $semester,
        string $startDate,
        string $endDate
    ) {
        $this->id = $id;
        $this->year = $year;
        $this->semester = $semester;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getYear(): int
    {
        return $this->year;
    }

    public function getSemester(): int
    {
        return $this->semester;
    }

    public function getStartDate(): string
    {
        return $this->startDate;
    }

    public function getEndDate(): string
    {
        return $this->endDate;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'year' => $this->year,
            'semester' => $this->semester,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate
        ];
    }
}

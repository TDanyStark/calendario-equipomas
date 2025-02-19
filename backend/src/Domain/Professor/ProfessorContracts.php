<?php

declare(strict_types=1);

namespace App\Domain\Professor;

use JsonSerializable;

class ProfessorContracts implements JsonSerializable
{
    private int $id;
    private string $professorID;
    private int $academicPeriodID;
    private int $hours;

    public function __construct(
        int $id,
        string $professorID,
        int $academicPeriodID,
        int $hours
    ) {
        $this->id = $id;
        $this->professorID = $professorID;
        $this->academicPeriodID = $academicPeriodID;
        $this->hours = $hours;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getProfessorID(): string
    {
        return $this->professorID;
    }

    public function getAcademicPeriodID(): int
    {
        return $this->academicPeriodID;
    }

    public function getHours(): int
    {
        return $this->hours;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'professorID' => $this->professorID,
            'academicPeriodID' => $this->academicPeriodID,
            'hours' => $this->hours
        ];
    }
}
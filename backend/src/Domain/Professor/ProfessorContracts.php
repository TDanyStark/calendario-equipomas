<?php

declare(strict_types=1);

namespace App\Domain\Professor;

use JsonSerializable;

class ProfessorContracts implements JsonSerializable
{
    private int $id;
    private string $professorID;
    private int $academicPeriodID;
    private bool $with_contract;
    private int $hours;
    private ?string $date_assign;

    public function __construct(
        int $id,
        string $professorID,
        int $academicPeriodID,
        bool $with_contract,
        int $hours,
        ?string $date_assign
    ) {
        $this->id = $id;
        $this->professorID = $professorID;
        $this->academicPeriodID = $academicPeriodID;
        $this->with_contract = $with_contract;
        $this->hours = $hours;
        $this->date_assign = $date_assign;
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

    public function getWithContract(): bool
    {
        return $this->with_contract;
    }

    public function getHours(): int
    {
        return $this->hours;
    }

    public function getDateAssign(): ?string
    {
        return $this->date_assign;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'professorID' => $this->professorID,
            'academicPeriodID' => $this->academicPeriodID,
            'with_contract' => $this->with_contract,
            'hours' => $this->hours,
            'date_assign' => $this->date_assign
        ];
    }
}
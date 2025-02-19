<?php

declare(strict_types=1);

namespace App\Domain\Professor;

use JsonSerializable; // Importa la interfaz JsonSerializable

class ProfessorAvailability implements JsonSerializable
{
    private int $AvailabilityID;
    private string $ProfessorID;
    private int $DayID;
    private string $StartTime;
    private string $EndTime;
    private int $academicPeriodID;

    public function __construct(
        int $AvailabilityID,
        string $ProfessorID,
        int $DayID,
        string $StartTime,
        string $EndTime,
        int $academicPeriodID
    ) {
        $this->AvailabilityID = $AvailabilityID;
        $this->ProfessorID = $ProfessorID;
        $this->DayID = $DayID;
        $this->StartTime = $StartTime;
        $this->EndTime = $EndTime;
        $this->academicPeriodID = $academicPeriodID;
    }

    public function getAvailabilityID(): int
    {
        return $this->AvailabilityID;
    }

    public function getProfessorID(): string
    {
        return $this->ProfessorID;
    }

    public function getDayID(): int
    {
        return $this->DayID;
    }

    public function getStartTime(): string
    {
        return $this->StartTime;
    }

    public function getEndTime(): string
    {
        return $this->EndTime;
    }

    public function getAcademicPeriodID(): int
    {
        return $this->academicPeriodID;
    }


    public function jsonSerialize(): array
    {
        return [
            'availabilityID' => $this->AvailabilityID,
            'professorID' => $this->ProfessorID,
            'dayID' => (string)$this->DayID,
            'academicPeriodID' => $this->academicPeriodID,
            'startTime' => $this->StartTime,
            'endTime' => $this->EndTime
        ];
    }
}

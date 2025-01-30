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

    public function __construct(
        int $AvailabilityID,
        string $ProfessorID,
        int $DayID,
        string $StartTime,
        string $EndTime
    ) {
        $this->AvailabilityID = $AvailabilityID;
        $this->ProfessorID = $ProfessorID;
        $this->DayID = $DayID;
        $this->StartTime = $StartTime;
        $this->EndTime = $EndTime;
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
    public function jsonSerialize(): array
    {
        return [
            'AvailabilityID' => $this->AvailabilityID,
            'ProfessorID' => $this->ProfessorID,
            'DayID' => $this->DayID,
            'StartTime' => $this->StartTime,
            'EndTime' => $this->EndTime
        ];
    }
}
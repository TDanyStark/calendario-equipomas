<?php

declare(strict_types=1);

namespace App\Domain\Professor;

use JsonSerializable; // Importa la interfaz JsonSerializable

class ProfessorInstruments implements JsonSerializable
{
    private int $ProfessorInstrumentID;
    private string $ProfessorID; 
    private int $InstrumentID;
    private int $academicPeriodID;
    private ?string $InstrumentName;

    public function __construct(
        int $ProfessorInstrumentID,
        string $ProfessorID, // Cambiar a string
        int $InstrumentID,
        int $academicPeriodID,
        ?string $InstrumentName = null
    ) {
        $this->ProfessorInstrumentID = $ProfessorInstrumentID;
        $this->ProfessorID = $ProfessorID;
        $this->InstrumentID = $InstrumentID;
        $this->academicPeriodID = $academicPeriodID;
        $this->InstrumentName = $InstrumentName;
    }

    public function getProfessorInstrumentID(): int
    {
        return $this->ProfessorInstrumentID;
    }

    public function getProfessorID(): string 
    {
        return $this->ProfessorID;
    }

    public function getInstrumentID(): int
    {
        return $this->InstrumentID;
    }

    public function getInstrumentName(): string
    {
        return $this->InstrumentName;
    }

    public function getAcademicPeriodID(): int
    {
        return $this->academicPeriodID;
    }

    public function jsonSerialize(): array
    {
        return [
            'ProfessorInstrumentID' => $this->ProfessorInstrumentID,
            'id' => (string)$this->InstrumentID,
            'name' => $this->InstrumentName,
            'academicPeriodID' => $this->academicPeriodID
        ];
    }
}
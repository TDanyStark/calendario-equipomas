<?php

declare(strict_types=1);

namespace App\Domain\Professor;

use JsonSerializable; // Importa la interfaz JsonSerializable

class ProfessorInstruments implements JsonSerializable
{
    private int $ProfessorInstrumentID;
    private string $ProfessorID; 
    private int $InstrumentID;

    public function __construct(
        int $ProfessorInstrumentID,
        string $ProfessorID, // Cambiar a string
        int $InstrumentID
    ) {
        $this->ProfessorInstrumentID = $ProfessorInstrumentID;
        $this->ProfessorID = $ProfessorID;
        $this->InstrumentID = $InstrumentID;
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

    public function jsonSerialize(): array
    {
        return [
            'ProfessorInstrumentID' => $this->ProfessorInstrumentID,
            'id' => (string)$this->InstrumentID,
        ];
    }
}
<?php

declare(strict_types=1);

namespace App\Domain\Professor;

use JsonSerializable; // Importa la interfaz JsonSerializable

class ProfessorRooms implements JsonSerializable
{
    private int $ProfessorRoomID;
    private string $ProfessorID; 
    private int $RoomID;
    private int $academicPeriodID;

    public function __construct(
        int $ProfessorRoomID,
        string $ProfessorID,
        int $RoomID,
        int $academicPeriodID
    ) {
        $this->ProfessorRoomID = $ProfessorRoomID;
        $this->ProfessorID = $ProfessorID;
        $this->RoomID = $RoomID;
        $this->academicPeriodID = $academicPeriodID;
    }

    public function getProfessorRoomID(): int
    {
        return $this->ProfessorRoomID;
    }

    public function getProfessorID(): string
    {
        return $this->ProfessorID;
    }

    public function getRoomID(): int
    {
        return $this->RoomID;
    }

    public function getAcademicPeriodID(): int
    {
        return $this->academicPeriodID;
    }

    public function jsonSerialize(): array
    {
        return [
            'ProfessorRoomID' => $this->ProfessorRoomID,
            'id' => (string)$this->RoomID,
            'academicPeriodID' => $this->academicPeriodID
        ];
    }
}
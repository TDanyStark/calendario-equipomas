<?php

declare(strict_types=1);

namespace App\Domain\Professor;

use JsonSerializable; // Importa la interfaz JsonSerializable

class ProfessorRooms implements JsonSerializable
{
    private int $ProfessorRoomID;
    private string $ProfessorID; 
    private int $RoomID;

    public function __construct(
        int $ProfessorRoomID,
        string $ProfessorID,
        int $RoomID
    ) {
        $this->ProfessorRoomID = $ProfessorRoomID;
        $this->ProfessorID = $ProfessorID;
        $this->RoomID = $RoomID;
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

    public function jsonSerialize(): array
    {
        return [
            'ProfessorRoomID' => $this->ProfessorRoomID,
            'ProfessorID' => $this->ProfessorID,
            'RoomID' => $this->RoomID,
        ];
    }
}
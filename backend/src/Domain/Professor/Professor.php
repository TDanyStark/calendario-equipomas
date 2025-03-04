<?php

declare(strict_types=1);

namespace App\Domain\Professor;

use App\Domain\PersonInterface;
use App\Domain\User\User; // Importa la clase User

class Professor implements PersonInterface
{
    private string $professorID;
    private string $firstName;
    private string $lastName;
    private ?string $phone;
    private string $status;
    private User $user; // Relación con la clase User
    private ?array $instruments = [];
    private ?array $rooms = [];
    private ?array $availability = [];
    private ?bool $contract = false;
    private ?int $hours = 0;

    public function __construct(
        string $professorID,
        string $firstName,
        string $lastName,
        ?string $phone,
        string $status,
        User $user, // Pasar el objeto User
        ?array $instruments = [],
        ?array $rooms = [],
        ?array $availability = [],
        ?bool $contract = false,
        ?int $hours = 0
    ) {
        $this->professorID = $professorID;
        $this->firstName = ucfirst($firstName);
        $this->lastName = ucfirst($lastName);
        $this->phone = $phone;
        $this->status = $status;
        $this->user = $user; // Asignar el objeto User
        $this->instruments = $instruments;
        $this->rooms = $rooms;
        $this->availability = $availability;
        $this->contract = $contract;
        $this->hours = $hours;
    }

    public function getProfessorID(): string
    {
        return $this->professorID;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getUser(): User
    {
        return $this->user; 
    }

    public function getInstruments(): ?array
    {
        return $this->instruments;
    }

    public function getRooms(): ?array
    {
        return $this->rooms;
    }

    public function getAvailability(): ?array
    {
        return $this->availability;
    }

    public function getContract(): ?bool
    {
        return $this->contract;
    }

    public function getHours(): ?int
    {
        return $this->hours;
    }
    
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->professorID,
            'name' => $this->firstName . ' ' . $this->lastName,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'phone' => $this->phone,
            'status' => $this->status,
            'user' => $this->user, // Incluir información del usuario
            'instruments' => $this->instruments,
            'rooms' => $this->rooms,
            'availability' => $this->availability,
            'contract' => $this->contract,
            'hours' => $this->hours
        ];
    }
}
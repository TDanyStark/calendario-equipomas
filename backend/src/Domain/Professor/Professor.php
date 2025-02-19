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

    public function __construct(
        string $professorID,
        string $firstName,
        string $lastName,
        ?string $phone,
        string $status,
        User $user, // Pasar el objeto User
    ) {
        $this->professorID = $professorID;
        $this->firstName = ucfirst($firstName);
        $this->lastName = ucfirst($lastName);
        $this->phone = $phone;
        $this->status = $status;
        $this->user = $user; // Asignar el objeto User
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
        ];
    }
}
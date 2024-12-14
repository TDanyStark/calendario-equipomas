<?php

declare(strict_types=1);

namespace App\Domain\Student;

use App\Domain\PersonInterface;
use App\Domain\User\User; // Importa la clase User

class Student implements PersonInterface
{
    private string $studentID;
    private string $firstName;
    private string $lastName;
    private ?string $phone;
    private string $status;
    private User $user; // Relación con la clase User

    public function __construct(
        string $studentID,
        string $firstName,
        string $lastName,
        ?string $phone,
        string $status,
        User $user // Pasar el objeto User
    ) {
        $this->studentID = $studentID;
        $this->firstName = ucfirst($firstName);
        $this->lastName = ucfirst($lastName);
        $this->phone = $phone;
        $this->status = $status;
        $this->user = $user; // Asignar el objeto User
    }

    public function getStudentID(): string
    {
        return $this->studentID;
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
        return $this->user; // Método para obtener el objeto User
    }

    public function jsonSerialize(): array
    {
        return [
            'studentID' => $this->studentID,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'phone' => $this->phone,
            'status' => $this->status,
            'user' => $this->user, // Incluir información del usuario
        ];
    }
}

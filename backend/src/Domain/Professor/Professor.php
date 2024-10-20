<?php

declare(strict_types=1);

namespace App\Domain\Professor;

use JsonSerializable;

class Professor implements JsonSerializable
{
    private string $ProfessorID;
    private string $firstName;
    private string $lastName;
    private string $email;
    private ?string $phone;
    private string $status;

    public function __construct(
        string $ProfessorID,
        string $firstName,
        string $lastName,
        string $email,
        ?string $phone,
        string $status
    ) {
        $this->ProfessorID = $ProfessorID;
        $this->firstName = ucfirst($firstName);
        $this->lastName = ucfirst($lastName);
        $this->email = $email;
        $this->phone = $phone;
        $this->status = $status;
    }

    public function getProfessorID(): string
    {
        return $this->ProfessorID;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function jsonSerialize(): array
    {
        return [
            'ProfessorID' => $this->ProfessorID,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status,
        ];
    }
}

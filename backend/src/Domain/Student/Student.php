<?php

declare(strict_types=1);

namespace App\Domain\Student;

use JsonSerializable;

class Student implements JsonSerializable
{
    private string $StudentID;
    private string $firstName;
    private string $lastName;
    private string $email;
    private ?string $phone;
    private string $status;

    public function __construct(
        string $StudentID,
        string $firstName,
        string $lastName,
        string $email,
        ?string $phone,
        string $status
    ) {
        $this->StudentID = $StudentID;
        $this->firstName = ucfirst($firstName);
        $this->lastName = ucfirst($lastName);
        $this->email = $email;
        $this->phone = $phone;
        $this->status = $status;
    }

    public function getStudentID(): string
    {
        return $this->StudentID;
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
            'StudentID' => $this->StudentID,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status,
        ];
    }
}

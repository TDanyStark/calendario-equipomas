<?php

declare(strict_types=1);

namespace App\Domain\Admin;

use App\Domain\PersonInterface;
use App\Domain\User\User; // Importa la clase User

class Admin implements PersonInterface
{
    private string $adminID;
    private string $firstName;
    private string $lastName;
    private User $user; // Relación con la clase User

    public function __construct(
        string $adminID,
        string $firstName,
        string $lastName,
        User $user // Pasar el objeto User
    ) {
        $this->adminID = $adminID;
        $this->firstName = ucfirst($firstName);
        $this->lastName = ucfirst($lastName);
        $this->user = $user; // Asignar el objeto User
    }

    public function getAdminID(): string
    {
        return $this->adminID;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function getUser(): User
    {
        return $this->user; // Método para obtener el objeto User
    }

    public function jsonSerialize(): array
    {
        return [
            'adminID' => $this->adminID,
            'firstName' => $this->firstName,
            'lastName' => $this->lastName,
            'user' => $this->user, // Incluir información del usuario
        ];
    }
}

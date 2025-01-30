<?php

declare(strict_types=1);

namespace App\Domain\User;

use JsonSerializable;
use App\Domain\Services\PasswordService;

class User implements JsonSerializable
{
    private string $userID; // Este será la cédula
    private string $email;
    private string $password; // Este es el hash de la contraseña
    private int $roleID; // Relacionado con el rol

    public function __construct(
        string $userID,
        string $email,
        ?string $password,
        int $roleID
    ) {
        $this->userID = $userID;
        $this->email = $email;
        $this->password = $password ? PasswordService::hash($password) : PasswordService::hash(PasswordService::generate());
        $this->roleID = $roleID;
    }

    public function getUserID(): string
    {
        return $this->userID;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPassword(): string
    {
        return $this->password; // Este es el hash de la contraseña
    }

    public function getRoleID(): int
    {
        return $this->roleID;
    }

    public function jsonSerialize(): array
    {
        return [
            'userID' => $this->userID,
            'email' => $this->email,
            'roleID' => $this->roleID,
        ];
    }

    // Método para verificar la contraseña
    public function verifyPassword(string $password): bool
    {
        return PasswordService::verify($password, $this->password);
    }
}

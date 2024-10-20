<?php

declare(strict_types=1);

namespace App\Domain\Role;

use JsonSerializable;

class Role implements JsonSerializable
{
    private int $roleID;
    private string $roleName;

    public function __construct(int $roleID, string $roleName)
    {
        $this->roleID = $roleID;
        $this->roleName = $roleName;
    }

    public function getRoleID(): int
    {
        return $this->roleID;
    }

    public function getRoleName(): string
    {
        return $this->roleName;
    }

    public function jsonSerialize(): array
    {
        return [
            'roleID' => $this->roleID,
            'roleName' => $this->roleName,
        ];
    }
}

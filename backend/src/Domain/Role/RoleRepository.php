<?php

declare(strict_types=1);

namespace App\Domain\Role;

interface RoleRepository
{
    /**
     * Encuentra un estudiante por su ID.
     * 
     * @param int $roleID
     * @return Role
     * @throws RoleNotFoundException
     */
    public function getRoleById(int $roleID): ?Role;
}

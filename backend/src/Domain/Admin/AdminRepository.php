<?php

declare(strict_types=1);

namespace App\Domain\Admin;

interface AdminRepository
{
    /**
     * Encuentra un admin por su ID.
     * 
     * @param string $id
     * @return Admin|null
     */
    public function findAdminById(string $id): ?Admin;
}

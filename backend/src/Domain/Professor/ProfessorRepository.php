<?php

declare(strict_types=1);

namespace App\Domain\Professor;

interface ProfessorRepository
{
    /**
     * Encuentra un profesor por su ID.
     * 
     * @param string $id
     * @return Professor|null
     */
    public function findProfessorById(string $id): ?Professor;

}

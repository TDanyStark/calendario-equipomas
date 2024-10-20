<?php

declare(strict_types=1);

namespace App\Domain\Professor;

interface ProfessorRepository
{
    /**
     * Encuentra un profesor por su email.
     * 
     * @param string $email
     * @return Professor|null
     */
    public function findProfessorByEmail(string $email): ?Professor;

}

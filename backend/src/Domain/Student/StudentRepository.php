<?php

declare(strict_types=1);

namespace App\Domain\Student;

interface StudentRepository
{
    /**
     * Encuentra un estudiante por su ID.
     * 
     * @param string $id
     * @return Student
     * @throws StudentNotFoundException
     */
    public function findStudentOfId(string $id): Student;

}

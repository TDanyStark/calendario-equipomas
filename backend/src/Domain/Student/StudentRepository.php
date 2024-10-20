<?php

declare(strict_types=1);

namespace App\Domain\Student;

interface StudentRepository
{
    /**
     * @return Student[]
     */
    public function findAll(): array;

    /**
     * Encuentra un estudiante por su ID.
     * 
     * @param string $id
     * @return Student
     * @throws StudentNotFoundException
     */
    public function findStudentOfId(string $id): Student;

    /**
     * Encuentra un estudiante por su email.
     * 
     * @param string $email
     * @return Student|null
     */
    public function findStudentByEmail(string $email): ?Student;
}

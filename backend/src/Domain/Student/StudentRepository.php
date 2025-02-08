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
    public function findStudentById(string $id): Student;

    /**
     * Devuelve todos los estudiantes.
     * 
     * @return array
     */
    public function findAll(int $limit, int $offset, string $query): array;
    public function create(Student $student): int;
    public function update(Student $student): bool;
    public function delete(string $id): bool;
    public function deleteMultiple(array $ids): int;
    public function findStudentsByQuery(string $query): array;
}

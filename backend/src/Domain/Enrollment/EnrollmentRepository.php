<?php

declare(strict_types=1);

namespace App\Domain\Enrollment;

interface EnrollmentRepository
{
    /**
     * Obtiene todas las inscripciones con paginación y búsqueda.
     */
    public function findAll(int $limit, int $offset, string $query, string $courseID, string $instrumentID, string $semesterID, int $academic_periodID): array;

    /**
     * Busca una inscripción por su ID.
     */
    public function findById(int $id): ?Enrollment;

    /**
     * Crea una nueva inscripción.
     */
    public function create(Enrollment $enrollment): int;

    /**
     * Actualiza una inscripción existente.
     */
    public function update(Enrollment $enrollment): bool;

    /**
     * Elimina una inscripción por su ID.
     */
    public function delete(int $id): bool;

    /**
     * Elimina múltiples inscripciones a partir de un array de IDs.
     */
    public function deleteMultiple(array $ids): int;

    public function updateByGroup(string $changeTo, string $query, string $courseID, string $instrumentID, string $semesterID): int;

}

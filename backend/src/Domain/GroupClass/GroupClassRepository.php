<?php

declare(strict_types=1);

namespace App\Domain\GroupClass;

interface GroupClassRepository
{
    /**
     * Obtiene todas las clases grupales con paginación y búsqueda.
     */
    public function findAll(): array;

    // /**
    //  * Busca una clase grupal por su ID.
    //  */
    // public function findById(int $id): ?GroupClass;

    public function create(GroupClass $groupClass): int;

    // public function update(GroupClass $groupClass): bool;

    // public function delete(int $id): bool;

    public function findAvailabilityByRoom(int $roomId, int $academicPeriodId): array;

}
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
    public function findAll(int $limit, int $offset, string $query, bool $offPagination, bool $onlyActive): array;
    public function create(Professor $profesor): int;
    public function update(Professor $profesor): bool;
    public function delete(string $id): bool;
    public function deleteMultiple(array $ids): int;
    public function findProfessorByQuery(string $query): array;
    public function findProfessorIdsActive(): array;
    public function findOnlyAssignIdsActive(int $academicPeriodID): array;
    public function seedProfessors(): void;
    public function assignProfessor(string $ID, array $professorInstrumentsArray, array $professorRoomsArray, array $professorAvailabilityArray, ?ProfessorContracts $professorContract = null): void;
    public function getProfessorsWithAssign(int $academicPeriodID, int $limit, int $offset, string $orderDir, string $query, bool $offPagination, bool $onlyWithAssignments): array;
}

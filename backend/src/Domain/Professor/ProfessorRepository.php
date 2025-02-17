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
}

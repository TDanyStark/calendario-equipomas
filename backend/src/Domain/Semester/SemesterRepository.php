<?php

declare(strict_types=1);

namespace App\Domain\Semester;

interface SemesterRepository
{
    public function findAll(): array;
    public function findById(int $id): ?Semester;
    public function create(Semester $semester): int;
    public function update(Semester $semester): bool;
    public function delete(int $id): bool;
    public function deleteMultiple(array $ids): int;
}

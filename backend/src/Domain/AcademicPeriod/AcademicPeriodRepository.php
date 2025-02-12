<?php

declare(strict_types=1);

namespace App\Domain\AcademicPeriod;

interface AcademicPeriodRepository {
    public function findAll(): array;
    public function findById(string $id): ?AcademicPeriod;
    public function create(AcademicPeriod $academicPeriod): int;
    public function update(AcademicPeriod $academicPeriod): bool;
    public function changeSelect(int $id): bool;
}
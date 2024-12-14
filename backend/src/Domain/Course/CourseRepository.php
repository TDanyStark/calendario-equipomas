<?php

declare(strict_types=1);

namespace App\Domain\Course;

interface CourseRepository
{
    public function findAll(): array;
    public function findById(string $id): ?Course;
    public function create(Course $course): int;
    public function update(Course $course): void;
    public function delete(string $id): void;
    public function deleteMultiple(array $ids): int;
}

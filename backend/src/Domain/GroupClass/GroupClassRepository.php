<?php

declare(strict_types=1);

namespace App\Domain\GroupClass;

interface GroupClassRepository
{
    /**
     * @return GroupClass[]
     */
    public function findAll(int $limit = 10, int $offset = 0, string $query = '', string $courseId = '', string $instrumentId = '', string $semesterId = '', string $professorId = '', string $studentId = '', int $academicPeriodId = 0, string $roomId = ''): array;

    /**
     * @return int The ID of the created group class
     */
    public function create(GroupClass $groupClass): int;

    /**
     * @return GroupClass[]
     */
    public function findAvailabilityByRoom(int $roomId, int $academicPeriodId): array;
}
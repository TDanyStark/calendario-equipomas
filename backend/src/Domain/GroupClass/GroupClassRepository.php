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

    /**
     * Find a group class by ID with its related enrollments and professors
     * @param int $id
     * @return GroupClass|null
     */
    public function findById(int $id): ?GroupClass;
    
    /**
     * Update an existing group class
     * @param GroupClass $groupClass
     * @return bool
     */
    public function update(GroupClass $groupClass): bool;

    /**
     * Delete a group class by its ID
     * @param int $id
     * @return bool True on success, false on failure or if not found
     */
    public function delete(int $id): bool;

    /**
     * Delete multiple group classes by their IDs
     * @param int[] $ids
     * @return int The number of group classes actually deleted
     */
    public function deleteMultiple(array $ids): int;
}
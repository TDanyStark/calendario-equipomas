<?php

declare(strict_types=1);

namespace App\Domain\Enrollments;

interface EnrollmentsRepository
{
    /**
     * @param int $limit
     * @param int $offset
     * @param string $query
     */
    public function findAll(int $limit, int $offset, string $query): array;
}
<?php

declare(strict_types=1);

namespace App\Domain\Course;

use JsonSerializable;

class CourseAvailability implements JsonSerializable
{
    private string $dayOfWeek;
    private ?string $startTime;
    private ?string $endTime;

    public function __construct(string $dayOfWeek, ?string $startTime, ?string $endTime)
    {
        $this->dayOfWeek = $dayOfWeek;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
    }

    public function jsonSerialize(): array
    {
        return [
            'dayOfWeek' => $this->dayOfWeek,
            'startTime' => $this->startTime,
            'endTime' => $this->endTime,
        ];
    }
}

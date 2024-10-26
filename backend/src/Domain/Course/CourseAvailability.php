<?php

declare(strict_types=1);

namespace App\Domain\Course;

use App\Domain\Shared\Days\DayOfWeek;

use JsonSerializable;

class CourseAvailability implements JsonSerializable
{
    private DayOfWeek $dayOfWeek;
    private ?string $startTime;
    private ?string $endTime;

    public function __construct(DayOfWeek $dayOfWeek, ?string $startTime, ?string $endTime)
    {
        $this->dayOfWeek = $dayOfWeek;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
    }

    public function jsonSerialize(): array
    {
        return [
            'dayOfWeek' => $this->dayOfWeek->value,
            'startTime' => $this->startTime,
            'endTime' => $this->endTime,
        ];
    }
}

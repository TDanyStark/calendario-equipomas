<?php

declare(strict_types=1);

namespace App\Domain\Course;

use App\Domain\Shared\Days\ScheduleDay;
use JsonSerializable;

class CourseAvailability implements JsonSerializable
{
    private string $id;
    private ScheduleDay $scheduleDay;
    private ?string $startTime;
    private ?string $endTime;

    public function __construct(
        string $id,
        ScheduleDay $scheduleDay,
        ?string $startTime,
        ?string $endTime
    ) {
        $this->id = $id;
        $this->scheduleDay = $scheduleDay;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getScheduleDay(): ScheduleDay
    {
        return $this->scheduleDay;
    }

    public function getStartTime(): ?string
    {
        return $this->startTime;
    }

    public function getEndTime(): ?string
    {
        return $this->endTime;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->scheduleDay->getDayId(),
            'dayName' => $this->scheduleDay->getDayName()->value,
            'dayDisplayName' => $this->scheduleDay->getDayDisplayName(),
            'startTime' => $this->startTime,
            'endTime' => $this->endTime,
        ];
    }
}

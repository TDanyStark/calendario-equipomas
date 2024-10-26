<?php

declare(strict_types=1);

namespace App\Domain\Shared\Days;

use JsonSerializable;

class ScheduleDay implements JsonSerializable
{
    private int $dayId;
    private DayOfWeek $dayName;
    private string $dayDisplayName;
    private string $startTime;
    private string $endTime;

    public function __construct(
        int $dayId,
        DayOfWeek $dayName,
        string $dayDisplayName,
        string $startTime,
        string $endTime
    ) {
        $this->dayId = $dayId;
        $this->dayName = $dayName;
        $this->dayDisplayName = $dayDisplayName;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
    }

    public function getDayId(): int
    {
        return $this->dayId;
    }

    public function getDayName(): DayOfWeek
    {
        return $this->dayName;
    }

    public function getDayDisplayName(): string
    {
        return $this->dayDisplayName;
    }

    public function getStartTime(): string
    {
        return $this->startTime;
    }

    public function getEndTime(): string
    {
        return $this->endTime;
    }

    public function jsonSerialize(): array
    {
        return [
            'dayId' => $this->dayId,
            'dayName' => $this->dayName->value,
            'dayDisplayName' => $this->dayDisplayName,
            'startTime' => $this->startTime,
            'endTime' => $this->endTime,
        ];
    }
}

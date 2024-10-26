<?php

declare(strict_types=1);

namespace App\Domain\Shared\Days;

use JsonSerializable;

class ScheduleDay implements JsonSerializable
{
    private string $id;
    private DayOfWeek $dayName;
    private string $dayDisplayName;
    private string $startTime;
    private string $endTime;

    public function __construct(
        string $id,
        DayOfWeek $dayName,
        string $dayDisplayName,
        string $startTime,
        string $endTime
    ) {
        $this->id = $id;
        $this->dayName = $dayName;
        $this->dayDisplayName = $dayDisplayName;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
    }

    public function getDayId(): string
    {
        return $this->id;
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
            'id' => $this->id,
            'dayName' => $this->dayName->value,
            'dayDisplayName' => $this->dayDisplayName,
            'startTime' => $this->startTime,
            'endTime' => $this->endTime,
        ];
    }
}

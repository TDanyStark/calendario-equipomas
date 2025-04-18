<?php

declare(strict_types=1);

namespace App\Domain\GroupClass;

use JsonSerializable;
use InvalidArgumentException;

class GroupClass implements JsonSerializable
{
    private int $id;
    private string $name;
    private int $roomId;
    private ?int $academicPeriodId;
    private int $day_id;
    private string $startTime;
    private string $endTime;
    private ?array $professors = [];
    private ?array $enrollments = [];
    private ?string $roomName = null;
    private ?string $dayDisplayName = null;

    public function __construct(int $id, string $name, int $roomId, ?int $academicPeriodId, int $day_id, string $startTime, string $endTime, ?array $professors = null, ?array $enrollments = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->roomId = $roomId;
        $this->academicPeriodId = $academicPeriodId;
        $this->day_id = $day_id;
        $this->startTime = $this->validateTimeFormat($startTime);
        $this->endTime = $this->validateTimeFormat($endTime);
        $this->professors = $professors ?? [];
        $this->enrollments = $enrollments ?? [];

        if (strtotime($this->startTime) >= strtotime($this->endTime)) {
            throw new InvalidArgumentException('El startTime no puede ser mayor o igual que el endTime.');
        }
    }

    private function validateTimeFormat(string $time): string
    {
        // Normaliza formatos "HH:MM" a "HH:MM:00"
        if (preg_match('/^\d{2}:\d{2}$/', $time)) {
            $time .= ':00';
        }

        // Valida que el formato sea correcto
        if (!preg_match('/^\d{2}:\d{2}:\d{2}$/', $time)) {
            throw new InvalidArgumentException('El formato de hora debe ser HH:MM o HH:MM:SS.');
        }

        return $time;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getRoomId(): int
    {
        return $this->roomId;
    }

    public function getAcademicPeriodId(): int
    {
        return $this->academicPeriodId;
    }

    public function getDayId(): int
    {
        return $this->day_id;
    }

    public function getStartTime(): string
    {
        return $this->startTime;
    }

    public function getEndTime(): string
    {
        return $this->endTime;
    }

    public function getProfessors(): array
    {
        return $this->professors;
    }

    public function getEnrollments(): array
    {
        return $this->enrollments;
    }

    public function addProfessor(int $professorId): void
    {
        $this->professors[] = $professorId;
    }

    public function addEnrollment(int $enrollmentId): void
    {
        $this->enrollments[] = $enrollmentId;
    }

    public function getRoomName(): ?string
    {
        return $this->roomName;
    }

    public function setRoomName(?string $roomName): void
    {
        $this->roomName = $roomName;
    }

    public function getDayDisplayName(): ?string
    {
        return $this->dayDisplayName;
    }

    public function setDayDisplayName(?string $dayDisplayName): void
    {
        $this->dayDisplayName = $dayDisplayName;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'roomId' => $this->roomId,
            'academicPeriodId' => $this->academicPeriodId,
            'day_id' => $this->day_id,
            'startTime' => $this->startTime,
            'endTime' => $this->endTime,
            'professors' => $this->professors,
            'enrollments' => $this->enrollments,
            'roomName' => $this->roomName,
            'dayDisplayName' => $this->dayDisplayName
        ];
    }
}

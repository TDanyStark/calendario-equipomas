<?php

declare(strict_types=1);


namespace App\Domain\Course;

use JsonSerializable;

class Course implements JsonSerializable
{
    private string $id;
    private string $name;
    private bool $isOnline;
    private int $duration;
    private string $createdAt;
    private string $updatedAt;
    /** @var CourseAvailability[] */
    private array $availability;

    public function __construct(
        string $id,
        string $name,
        bool $isOnline,
        int $duration,
        string $createdAt,
        string $updatedAt,
        array $availability = []
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->isOnline = $isOnline;
        $this->duration = $duration;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->availability = $availability;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getIsOnline(): bool
    {
        return $this->isOnline;
    }

    public function getDuration(): int
    {
        return $this->duration;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): string
    {
        return $this->updatedAt;
    }

    public function getAvailability(): array
    {
        return $this->availability;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'isOnline' => $this->isOnline,
            'duration' => $this->duration,
            'availability' => $this->availability,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
        // return [
        //     'id' => $this->id,
        //     'name' => $this->name,
        //     'description' => $this->description,
        //     'isOnline' => $this->isOnline,
        //     'createdAt' => $this->createdAt,
        //     'updatedAt' => $this->updatedAt,
        //     'availability' => $this->availability,
        // ];
    }

}

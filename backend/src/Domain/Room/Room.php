<?php

declare(strict_types=1);

namespace App\Domain\Room;

use JsonSerializable;

class Room implements JsonSerializable
{
    private string $id;
    private string $name;
    private int $capacity;
    private string $createdAt;
    private string $updatedAt;

    public function __construct(string $id, string $name, int $capacity, string $createdAt, string $updatedAt)
    {
        $this->id = $id;
        $this->name = $name;
        $this->capacity = $capacity;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getCapacity(): int
    {
        return $this->capacity;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): string
    {
        return $this->updatedAt;
    }

    // Método para serializar la entidad a un array
    public function toArray(array $options = []): array
    {
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'capacity' => $this->capacity,
        ];

        return $data;
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
        // return [
        //     'id' => $this->id,
        //     'name' => $this->name,
        //     'capacity' => $this->capacity,
        //     'created_at' => $this->createdAt,
        //     'updated_at' => $this->updatedAt,
        // ];
    }
}

<?php

declare(strict_types=1);

namespace App\Domain\Semester;

use JsonSerializable;

class Semester implements JsonSerializable
{
    private string $id;
    private string $name;
    private string $createdAt;
    private string $updatedAt;

    public function __construct(string $id, string $name, string $createdAt, string $updatedAt)
    {
        $this->id = $id;
        $this->name = $name;
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

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): string
    {
        return $this->updatedAt;
    }

    public function jsonSerialize(): array
    {
        return [
          'id' => $this->id,
          'name' => $this->name,
      ];
    }
}

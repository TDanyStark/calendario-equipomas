<?php

declare(strict_types=1);

namespace App\Domain\Instrument;

use JsonSerializable;

class Instrument implements JsonSerializable
{
    private ?int $id;
    private string $instrumentName;
    private string $createdAt;
    private string $updatedAt;

    public function __construct(
        ?int $id,
        string $instrumentName,
        string $createdAt,
        string $updatedAt
    ) {
        $this->id = $id;
        $this->instrumentName = $instrumentName;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getid(): int
    {
        return $this->id;
    }

    public function getInstrumentName(): string
    {
        return $this->instrumentName;
    }

    public function getCreatedAt(): string
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): string
    {
        return $this->updatedAt;
    }

    // Setter for InstrumentName
    public function setInstrumentName(string $instrumentName): void
    {
        $this->instrumentName = $instrumentName;
    }

    public function toArray(array $options = []): array
    {
        $data = [
            'id' => $this->id,
            'instrumentName' => $this->instrumentName,
        ];

        return $data;
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
        // return [
        //     'id' => $this->id,
        //     'instrumentName' => $this->instrumentName,
        //     'createdAt' => $this->createdAt,
        //     'updatedAt' => $this->updatedAt,
        // ];
    }
}

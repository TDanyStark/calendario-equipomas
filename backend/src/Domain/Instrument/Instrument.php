<?php

declare(strict_types=1);

namespace App\Domain\Instrument;

use JsonSerializable;

class Instrument implements JsonSerializable
{
    private int $instrumentID;
    private string $instrumentName;
    private string $createdAt;
    private string $updatedAt;

    public function __construct(
        int $instrumentID,
        string $instrumentName,
        string $createdAt,
        string $updatedAt
    ) {
        $this->instrumentID = $instrumentID;
        $this->instrumentName = $instrumentName;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getInstrumentID(): int
    {
        return $this->instrumentID;
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

    public function jsonSerialize(): array
    {
        return [
            'instrumentID' => $this->instrumentID,
            'instrumentName' => $this->instrumentName,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
        ];
    }
}

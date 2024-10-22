<?php

declare(strict_types=1);

namespace App\Domain\Instrument;

interface InstrumentRepository
{
    public function findAll(): array;

    public function findById(string $instrumentID): ?Instrument;

    public function create(Instrument $instrument): void;

    public function update(string $instrumentID, Instrument $instrument): void;

    public function delete(string $instrumentID): void;
}

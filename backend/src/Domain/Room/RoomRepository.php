<?php

declare(strict_types=1);

namespace App\Domain\Room;

interface RoomRepository
{
    public function findAll(): array;
    public function findById(int $id): ?Room;
    public function create(Room $room): int;
    public function update(Room $room): bool;
    public function delete(int $id): bool;
}

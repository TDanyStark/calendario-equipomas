<?php

declare(strict_types=1);

namespace App\Domain\User;

interface UserRepository
{
    /**
     * @param string $id
     * @return User
     * @throws UserNotFoundException
     */
    public function findUserById(string $id): ?User;
}

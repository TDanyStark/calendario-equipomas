<?php

declare(strict_types=1);

namespace App\Domain;
use App\Domain\User\User;

use JsonSerializable;

interface PersonInterface extends JsonSerializable
{
    public function getFirstName(): string;
    public function getUser(): User;
}

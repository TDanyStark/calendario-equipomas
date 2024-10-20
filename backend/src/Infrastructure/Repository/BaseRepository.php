<?php

declare(strict_types=1);

namespace App\Infrastructure\Repository;

use PDO;

abstract class BaseRepository
{
    protected PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }
}

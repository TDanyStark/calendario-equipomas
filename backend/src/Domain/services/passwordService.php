<?php

declare(strict_types=1);

namespace App\Domain\Services;

class PasswordService
{
    // Genera una contraseña aleatoria
    public static function generate(int $length = 4): string
    {
        return bin2hex(random_bytes($length / 2));
    }

    // Hashea una contraseña usando password_hash
    public static function hash(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    // Verifica si una contraseña es válida
    public static function verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }
}

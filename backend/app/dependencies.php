<?php

declare(strict_types=1);

use DI\ContainerBuilder;
use App\Infrastructure\Database;


return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        'jwtSecret' => $_ENV['JWT_SECRET'],

        Database::class => function () {
            return new Database();
        },
    ]);

    // Cargar configuraciones de otras partes
    require __DIR__ . '/dependencies/logger.php';
    require __DIR__ . '/dependencies/repositories.php';
    require __DIR__ . '/dependencies/middlewares.php';
    require __DIR__ . '/dependencies/actions.php';
};

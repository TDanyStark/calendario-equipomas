<?php

declare(strict_types=1);

use DI\ContainerBuilder;
use App\Infrastructure\Database;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Processor\UidProcessor;
use Psr\Log\LoggerInterface;
use Psr\Container\ContainerInterface;
use App\Application\Settings\SettingsInterface;


return function (ContainerBuilder $containerBuilder) {
    $containerBuilder->addDefinitions([
        'jwtSecret' => $_ENV['JWT_SECRET'],

        LoggerInterface::class => function (ContainerInterface $c) {
            $settings = $c->get(SettingsInterface::class);

            $loggerSettings = $settings->get('logger');
            $logger = new Logger($loggerSettings['name']);

            $processor = new UidProcessor();
            $logger->pushProcessor($processor);

            $handler = new StreamHandler($loggerSettings['path'], $loggerSettings['level']);
            $logger->pushHandler($handler);

            return $logger;
        },

        Database::class => function () {
            return new Database();
        },
    ]);

    // Cargar configuraciones de otras partes
    require __DIR__ . '/dependencies/middlewares.php';
    require __DIR__ . '/dependencies/actions.php';
};

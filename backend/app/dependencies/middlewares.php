<?php

declare(strict_types=1);


use Psr\Container\ContainerInterface;
use App\Application\Middleware\RoleMiddleware;
use Psr\Log\LoggerInterface;

$containerBuilder->addDefinitions([
  RoleMiddleware::class => function (ContainerInterface $c) {
    $jwtSecret = $c->get('jwtSecret');
    $logger = $c->get(LoggerInterface::class); // <-- Aquí obtienes la instancia real
    return new RoleMiddleware($jwtSecret, $logger);
  }
]);

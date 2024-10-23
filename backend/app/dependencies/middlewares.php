<?php

declare(strict_types=1);


use Psr\Container\ContainerInterface;
use App\Application\Middleware\RoleMiddleware;

$containerBuilder->addDefinitions([
  RoleMiddleware::class => function (ContainerInterface $c) {
    $jwtSecret = $c->get('jwtSecret');
    return new RoleMiddleware($jwtSecret);
}
]);

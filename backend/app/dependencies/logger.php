<?php

declare(strict_types=1);


use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Processor\UidProcessor;
use Psr\Log\LoggerInterface;
use Psr\Container\ContainerInterface;
use App\Application\Settings\SettingsInterface;

$containerBuilder->addDefinitions([
  LoggerInterface::class => function (ContainerInterface $c) {
    $settings = $c->get(SettingsInterface::class);

    $loggerSettings = $settings->get('logger');
    $logger = new Logger($loggerSettings['name']);

    $processor = new UidProcessor();
    $logger->pushProcessor($processor);

    $handler = new StreamHandler($loggerSettings['path'], $loggerSettings['level']);
    $logger->pushHandler($handler);

    return $logger;
  }
]);

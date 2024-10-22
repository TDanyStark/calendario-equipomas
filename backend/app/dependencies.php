<?php

declare(strict_types=1);

use App\Application\Settings\SettingsInterface;
use DI\ContainerBuilder;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\UidProcessor;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;
use App\Domain\Student\StudentRepository;
use App\Infrastructure\Database;
use App\Infrastructure\Repository\DatabaseStudentRepository;

use App\Domain\Professor\ProfessorRepository;
use App\Infrastructure\Repository\DatabaseProfessorRepository;

use App\Application\Actions\Auth\LoginAction;

use App\Application\Actions\Auth\ValidateJWTAction;
use App\Domain\Admin\AdminRepository;
use App\Domain\User\UserRepository;

use App\Domain\Role\RoleRepository;
use App\Infrastructure\Repository\DatabaseAdminRepository;
use App\Infrastructure\Repository\DatabaseRoleRepository;
use App\Infrastructure\Repository\DatabaseUserRepository;

use App\Domain\Instrument\InstrumentRepository;
use App\Infrastructure\Repository\DatabaseInstrumentRepository;

use App\Application\Middleware\RoleMiddleware;



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
        // Registra la clase Database en el contenedor
        Database::class => function () {
            return new Database();
        },

        // Registra el repositorio de estudiantes con la inyección de Database
        StudentRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DatabaseStudentRepository($database);
        },

        // Registrar ProfessorRepository usando Database
        ProfessorRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DatabaseProfessorRepository($database);
        },

        UserRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DatabaseUserRepository($database);
        },

        RoleRepository::class => function($container) {
            $database = $container->get(Database::class);
            return new DatabaseRoleRepository($database);
        },

        AdminRepository::class => function($container) {
            $database = $container->get(Database::class);
            return new DatabaseAdminRepository($database);
        },

        // Registrar LoginAction
        LoginAction::class => function (ContainerInterface $c) {
            $logger = $c->get(LoggerInterface::class);
            $userRepository = $c->get(UserRepository::class);
            $adminRepository = $c->get(AdminRepository::class);
            $studentRepository = $c->get(StudentRepository::class);
            $professorRepository = $c->get(ProfessorRepository::class);
            $roleRepository = $c->get(RoleRepository::class);
            $jwtSecret = $c->get('jwtSecret');
            return new LoginAction($logger, $userRepository, $adminRepository, $studentRepository, $professorRepository, $roleRepository, $jwtSecret);
        },

        ValidateJWTAction::class => function (ContainerInterface $c) {
            $logger = $c->get(LoggerInterface::class);
            $jwtSecret = $c->get('jwtSecret');
            return new ValidateJWTAction($logger, $jwtSecret);
        },

        InstrumentRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DatabaseInstrumentRepository($database);
        },

        RoleMiddleware::class => function (ContainerInterface $c) {
            $jwtSecret = $c->get('jwtSecret');
            return new RoleMiddleware($jwtSecret);
        }
    ]);
};

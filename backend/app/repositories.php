<?php

declare(strict_types=1);

use DI\ContainerBuilder;
use App\Domain\Student\StudentRepository;
use App\Infrastructure\Repository\DatabaseStudentRepository;
use App\Domain\Professor\ProfessorRepository;
use App\Infrastructure\Repository\DatabaseProfessorRepository;
use App\Infrastructure\Database;
use App\Domain\User\UserRepository;
use App\Infrastructure\Repository\DatabaseUserRepository;
use App\Domain\Role\RoleRepository;
use App\Infrastructure\Repository\DatabaseRoleRepository;
use App\Domain\Admin\AdminRepository;
use App\Infrastructure\Repository\DatabaseAdminRepository;

use App\Domain\Instrument\InstrumentRepository;
use App\Infrastructure\Repository\DatabaseInstrumentRepository;

return function (ContainerBuilder $containerBuilder) {
    // Here we map our UserRepository interface to its in memory implementation
    $containerBuilder->addDefinitions([
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

        RoleRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DatabaseRoleRepository($database);
        },

        AdminRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DatabaseAdminRepository($database);
        },

        InstrumentRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DatabaseInstrumentRepository($database);
        },
    ]);
};

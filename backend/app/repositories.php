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
use App\Domain\Course\Course;
use App\Infrastructure\Repository\DatabaseAdminRepository;

use App\Domain\Instrument\InstrumentRepository;
use App\Infrastructure\Repository\DatabaseInstrumentRepository;

use App\Domain\Room\RoomRepository;
use App\Infrastructure\Repository\DatabaseRoomRepository;

use App\Domain\Course\CourseRepository;
use App\Infrastructure\Repository\DatabaseCourseRepository;

use App\Domain\Shared\Days\ScheduleDayRepository;
use App\Domain\Shared\Settings\SettingRepository;
use App\Infrastructure\Repository\DbSettingRepository;
use App\Infrastructure\Repository\DbScheduleDayRepository;

use App\Domain\Semester\SemesterRepository;
use App\Infrastructure\Repository\DatabaseSemesterRepository;

use App\Domain\Enrollment\EnrollmentRepository;
use App\Infrastructure\Repository\DatabaseEnrollmentRepository;

use App\Domain\AcademicPeriod\AcademicPeriodRepository;
use App\Infrastructure\Repository\DatabaseAcademicPeriodRepository;

return function (ContainerBuilder $containerBuilder) {
    // Here we map our UserRepository interface to its in memory implementation
    $containerBuilder->addDefinitions([

        AcademicPeriodRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DatabaseAcademicPeriodRepository($database);
        },

        EnrollmentRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DatabaseEnrollmentRepository($database);
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

        RoomRepository::class => function($container){
            $database = $container->get(Database::class);
            return new DatabaseRoomRepository($database);
        },

        CourseRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DatabaseCourseRepository($database);
        },

        ScheduleDayRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DbScheduleDayRepository($database);
        },

        SettingRepository::class => function ($container) {
            $database = $container->get(Database::class);
            return new DbSettingRepository($database);
        },

        SemesterRepository::class => function($container){
            $database = $container->get(Database::class);
            return new DatabaseSemesterRepository($database);
        },
        
    ]);
};

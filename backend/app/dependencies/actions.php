<?php

declare(strict_types=1);


use Psr\Log\LoggerInterface;
use Psr\Container\ContainerInterface;
use App\Application\Actions\Auth\LoginAction;
use App\Application\Actions\Auth\ValidateJWTAction;
use App\Domain\User\UserRepository;
use App\Domain\Admin\AdminRepository;
use App\Domain\Student\StudentRepository;
use App\Domain\Professor\ProfessorRepository;
use App\Domain\Role\RoleRepository;

$containerBuilder->addDefinitions([

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
]);

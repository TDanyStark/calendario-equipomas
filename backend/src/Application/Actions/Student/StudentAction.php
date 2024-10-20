<?php

declare(strict_types=1);

namespace App\Application\Actions\Student;

use App\Application\Actions\Action;
use App\Domain\Student\StudentRepository;
use Psr\Log\LoggerInterface;

abstract class StudentAction extends Action
{
    protected StudentRepository $studentRepository;

    public function __construct(LoggerInterface $logger, StudentRepository $studentRepository)
    {
        parent::__construct($logger);
        $this->studentRepository = $studentRepository;
    }
}

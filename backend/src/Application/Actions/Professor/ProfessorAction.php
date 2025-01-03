<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use App\Application\Actions\Action;
use App\Domain\Professor\ProfessorRepository;
use Psr\Log\LoggerInterface;

abstract class ProfessorAction extends Action
{
    protected ProfessorRepository $professorRepository;

    public function __construct(LoggerInterface $logger, ProfessorRepository $professorRepository)
    {
        parent::__construct($logger);
        $this->professorRepository = $professorRepository;
    }
}

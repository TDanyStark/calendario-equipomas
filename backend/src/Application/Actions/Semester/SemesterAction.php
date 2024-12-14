<?php

declare(strict_types=1);

namespace App\Application\Actions\Semester;

use App\Application\Actions\Action;
use App\Domain\Semester\SemesterRepository;
use Psr\Log\LoggerInterface;

abstract class SemesterAction extends Action
{
    protected SemesterRepository $semesterRepository;

    public function __construct(LoggerInterface $logger, SemesterRepository $semesterRepository)
    {
        parent::__construct($logger);
        $this->semesterRepository = $semesterRepository;
    }
}

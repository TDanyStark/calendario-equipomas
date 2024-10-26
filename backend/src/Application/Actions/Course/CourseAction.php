<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use App\Application\Actions\Action;
use App\Domain\Course\CourseRepository;
use Psr\Log\LoggerInterface;

abstract class CourseAction extends Action
{
    protected CourseRepository $courseRepository;

    public function __construct(LoggerInterface $logger, CourseRepository $courseRepository)
    {
        parent::__construct($logger);
        $this->courseRepository = $courseRepository;
    }
}

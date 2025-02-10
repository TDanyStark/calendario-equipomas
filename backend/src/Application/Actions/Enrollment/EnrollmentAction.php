<?php

declare(strict_types=1);

namespace App\Application\Actions\Enrollment;

use App\Domain\Enrollment\EnrollmentRepository;
use Psr\Log\LoggerInterface;
use App\Application\Actions\Action;

abstract class EnrollmentAction extends Action{
  protected EnrollmentRepository $enrollmentRepository;

  public function __construct(LoggerInterface $logger, EnrollmentRepository $enrollmentRepository){
    parent::__construct($logger);
    $this->enrollmentRepository = $enrollmentRepository;
  }
}
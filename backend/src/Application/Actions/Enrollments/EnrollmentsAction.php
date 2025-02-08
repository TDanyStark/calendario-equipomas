<?php

declare(strict_types=1);

namespace App\Application\Actions\Enrollments;

use App\Domain\Enrollments\EnrollmentsRepository;
use Psr\Log\LoggerInterface;
use App\Application\Actions\Action;

abstract class EnrollmentsAction extends Action{
  protected EnrollmentsRepository $enrollmentRepository;

  public function __construct(LoggerInterface $logger, EnrollmentsRepository $enrollmentRepository){
    parent::__construct($logger);
    $this->enrollmentRepository = $enrollmentRepository;
  }
}
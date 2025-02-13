<?php

declare(strict_types=1);

namespace App\Application\Actions\Enrollment;

use App\Domain\Enrollment\EnrollmentRepository;
use Psr\Log\LoggerInterface;
use App\Application\Actions\Action;
use App\Domain\AcademicPeriod\AcademicPeriodRepository;

abstract class EnrollmentAction extends Action{
  protected EnrollmentRepository $enrollmentRepository;
  protected AcademicPeriodRepository $academicPeriodRepository; 

  public function __construct(LoggerInterface $logger, EnrollmentRepository $enrollmentRepository, AcademicPeriodRepository $academicPeriodRepository){
    parent::__construct($logger);
    $this->enrollmentRepository = $enrollmentRepository;
    $this->academicPeriodRepository = $academicPeriodRepository;
  }
}
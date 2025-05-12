<?php

declare(strict_types=1);
namespace App\Application\Actions\Dashboard;

use Psr\Log\LoggerInterface;
use App\Application\Actions\Action;
use App\Domain\AcademicPeriod\AcademicPeriodRepository;
use App\Domain\Enrollment\EnrollmentRepository;
use App\Domain\Professor\ProfessorRepository;

abstract class DashboardAction extends Action
{
    protected AcademicPeriodRepository $academicPeriodRepository;
    protected EnrollmentRepository $enrollmentRepository;
    protected ProfessorRepository $professorRepository;

    public function __construct(
        LoggerInterface $logger,
        AcademicPeriodRepository $academicPeriodRepository,
        EnrollmentRepository $enrollmentRepository,
        ProfessorRepository $professorRepository
    ) {
        parent::__construct($logger);
        $this->academicPeriodRepository = $academicPeriodRepository;
        $this->enrollmentRepository = $enrollmentRepository;
        $this->professorRepository = $professorRepository;
    }
}
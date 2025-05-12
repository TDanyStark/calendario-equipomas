<?php

declare(strict_types=1);

namespace App\Application\Actions\Dashboard;

use Psr\Http\Message\ResponseInterface as Response;

class GetDashboardStatsAction extends DashboardAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        try {
            $academic_periodID = $this->academicPeriodRepository->getActivePeriodID();

            // These methods are assumed to exist in your repositories
            $enrollmentCount = $this->enrollmentRepository->countByAcademicPeriodId($academic_periodID);
            $professorCount = $this->professorRepository->countAssignedToAcademicPeriod($academic_periodID);

            $stats = [
                'activePeriodEnrollmentCount' => $enrollmentCount,
                'activePeriodProfessorCount' => $professorCount,
                'activePeriodName' => $academic_periodID,
            ];

            $this->logger->info("Dashboard stats fetched for academic period '{$academic_periodID}'.");
            return $this->respondWithData($stats);
        } catch (\Exception $e) {
            $this->logger->error('Error fetching dashboard stats.', ['exception' => $e]);
            return $this->respondWithData(['error' => 'An unexpected error occurred while fetching dashboard statistics.'], 500);
        }
    }
}

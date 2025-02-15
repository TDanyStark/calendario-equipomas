<?php

declare(strict_types=1);

namespace App\Application\Actions\Enrollment;

use Psr\Http\Message\ResponseInterface as Response;

class ListEnrollmentIdsActiveAction extends EnrollmentAction
{
    protected function action(): Response
    {
        $academic_periodID = $this->academicPeriodRepository->getActivePeriodID();

        $enrollmentIds = $this->enrollmentRepository->findEnrollmentIdsActive($academic_periodID);

        return $this->respondWithData($enrollmentIds);
    }
}
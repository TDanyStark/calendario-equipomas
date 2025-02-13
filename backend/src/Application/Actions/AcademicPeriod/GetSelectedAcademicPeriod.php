<?php

declare(strict_types=1);

namespace App\Application\Actions\AcademicPeriod;

use Psr\Http\Message\ResponseInterface as Response;

class GetSelectedAcademicPeriod extends AcademicPeriodAction
{
    protected function action(): Response
    {
        $academicPeriod = $this->academicPeriodRepository->getSelected();
        return $this->respondWithData($academicPeriod);
    }
}
<?php

declare(strict_types=1);

namespace App\Application\Actions\AcademicPeriod;
use Psr\Http\Message\ResponseInterface as Response;


class UpdateAcademicPeriodAction extends AcademicPeriodAction
{
    protected function action(): Response
    {
        $data = $this->getFormData();
        $this->academicPeriodRepository->update($data);
        return $this->respondWithData($data);
    }
}
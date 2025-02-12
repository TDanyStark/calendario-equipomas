<?php

declare(strict_types=1);

namespace App\Application\Actions\AcademicPeriod;

use Psr\Http\Message\ResponseInterface as Response;

class SelectAcademicPeriodAction extends AcademicPeriodAction
{
    protected function action(): Response
    {
        $data = $this->getFormData();
        $id = (int)$data['id'];
        $this->academicPeriodRepository->changeSelect($id);
        return $this->respondWithData($data);
    }
}
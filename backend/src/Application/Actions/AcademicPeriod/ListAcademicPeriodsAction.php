<?php

declare(strict_types=1);

namespace App\Application\Actions\AcademicPeriod;

use Psr\Http\Message\ResponseInterface as Response;

class ListAcademicPeriodsAction extends AcademicPeriodAction
{
    protected function action(): Response
    {
        
        // Obtener todos los períodos académicos desde el repositorio
        $academicPeriods = $this->academicPeriodRepository->findAll();
        
        // Responder con los datos obtenidos
        return $this->respondWithData($academicPeriods);
    }
}

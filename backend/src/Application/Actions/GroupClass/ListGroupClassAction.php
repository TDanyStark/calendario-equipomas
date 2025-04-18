<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use Psr\Http\Message\ResponseInterface as Response;

class ListGroupClassAction extends GroupClassAction
{
    protected function action(): Response
    {
        // Obtiene los parámetros de la URL
        $page = (int) ($this->request->getQueryParams()['page'] ?? 1);
        $query = urldecode($this->request->getQueryParams()['query'] ?? '');
        $courseID = $this->request->getQueryParams()['course'] ?? '';
        $instrumentID = $this->request->getQueryParams()['instrument'] ?? '';
        $semesterID = $this->request->getQueryParams()['semester'] ?? '';
        $professorID = $this->request->getQueryParams()['professor'] ?? '';
        $studentID = $this->request->getQueryParams()['student'] ?? '';
        
        // Calcula el offset y el límite
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $academic_periodID = $this->academicPeriodRepository->getActivePeriodID();

        // Obtiene las clases grupales desde el repositorio con los filtros aplicados
        $groupClasses = $this->groupClassRepository->findAll($limit, $offset, $query, $courseID, $instrumentID, $semesterID, $professorID, $studentID, $academic_periodID);

        return $this->respondWithData($groupClasses);
    }
}
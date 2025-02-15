<?php

declare(strict_types=1);

namespace App\Application\Actions\Enrollment;

use Psr\Http\Message\ResponseInterface as Response;

class ListEnrollmentAction extends EnrollmentAction
{
    protected function action(): Response
    {
        // Obtiene los parámetros de la URL
        $page = (int) ($this->request->getQueryParams()['page'] ?? 1);
        $query = $this->request->getQueryParams()['query'] ?? '';
        $courseID = $this->request->getQueryParams()['course'] ?? '';
        $instrumentID = $this->request->getQueryParams()['instrument'] ?? '';
        $semesterID = $this->request->getQueryParams()['semester'] ?? '';
        $onlyActive = filter_var($this->request->getQueryParams()['onlyActive'] ?? false, FILTER_VALIDATE_BOOLEAN);

        // Calcula el offset y el límite
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $academic_periodID = $this->academicPeriodRepository->getActivePeriodID();

        // Obtiene todos los estudiantes desde el repositorio
        $enrollments = $this->enrollmentRepository->findAll($limit, $offset, $query, $courseID, $instrumentID, $semesterID, $academic_periodID, $onlyActive);

        return $this->respondWithData($enrollments);
    }
}
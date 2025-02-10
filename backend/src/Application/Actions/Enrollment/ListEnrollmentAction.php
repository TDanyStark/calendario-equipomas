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

        // Calcula el offset y el límite
        $limit = 10;
        $offset = ($page - 1) * $limit;

        // Obtiene todos los estudiantes desde el repositorio
        $enrollments = $this->enrollmentRepository->findAll($limit, $offset, $query);

        return $this->respondWithData($enrollments);
    }
}
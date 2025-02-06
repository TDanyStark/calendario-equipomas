<?php

declare(strict_types=1);

namespace App\Application\Actions\Student;

use Psr\Http\Message\ResponseInterface as Response;

class ListStudentsAction extends StudentAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        // Obtiene los parámetros de la URL
        $page = (int) ($this->request->getQueryParams()['page'] ?? 1);
        $query = $this->request->getQueryParams()['query'] ?? '';

        // Calcula el offset y el límite
        $limit = 10;
        $offset = ($page - 1) * $limit;

        // Obtiene todos los estudiantes desde el repositorio
        $students = $this->studentRepository->findAll($limit, $offset, $query);

        // Devuelve los estudiantes en formato JSON
        return $this->respondWithData($students);
    }
}

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
        $params = $this->request->getQueryParams();
        $page = isset($params['page']) ? (int) $params['page'] : 1;
        $query = isset($params['query']) ? (string)$params['query'] : '';
        $offPagination = isset($params['offPagination']) ? filter_var($params['offPagination'], FILTER_VALIDATE_BOOLEAN) : false;


        // Calcula el offset y el límite
        $limit = 10;
        $offset = ($page - 1) * $limit;

        // Obtiene todos los estudiantes desde el repositorio
        $students = $this->studentRepository->findAll($limit, $offset, $query, $offPagination);


        // Devuelve los estudiantes en formato JSON
        return $this->respondWithData($students);
    }
}

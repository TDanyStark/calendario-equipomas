<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use Psr\Http\Message\ResponseInterface as Response;

class ListProfessorsAction extends ProfessorAction
{
    protected function action(): Response
    {

        $params = $this->request->getQueryParams();
        $page = isset($params['page']) ? (int) $params['page'] : 1;
        $query = isset($params['query']) ? (string)$params['query'] : '';
        $offPagination = isset($params['offPagination']) ? filter_var($params['offPagination'], FILTER_VALIDATE_BOOLEAN) : false;

        // Calcula el offset y el límite
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $professors = $this->professorRepository->findAll($limit, $offset, $query, $offPagination);
        return $this->respondWithData($professors);
    }
}


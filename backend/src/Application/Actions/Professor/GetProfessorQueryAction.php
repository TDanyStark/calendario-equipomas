<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use Psr\Http\Message\ResponseInterface as Response;

class GetProfessorQueryAction extends ProfessorAction
{
    protected function action(): Response
    {
        $query = $this->request->getQueryParams()['q'] ?? '';
        $professors = $this->professorRepository->findProfessorByQuery($query);

        return $this->respondWithData($professors);
    }
}
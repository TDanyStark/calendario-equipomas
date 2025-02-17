<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use Psr\Http\Message\ResponseInterface as Response;

class ListProfessorIdsActiveAction extends ProfessorAction
{
    protected function action(): Response
    {
        $professorIds = $this->professorRepository->findProfessorIdsActive();
        return $this->respondWithData($professorIds);
    }
}
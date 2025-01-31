<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use Psr\Http\Message\ResponseInterface as Response;

class ListProfessorsAction extends ProfessorAction
{
    protected function action(): Response
    {
        $professors = $this->professorRepository->findAll();
        return $this->respondWithData($professors);
    }
}


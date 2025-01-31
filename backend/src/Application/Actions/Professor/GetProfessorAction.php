<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use Psr\Http\Message\ResponseInterface as Response;

class GetProfessorAction extends ProfessorAction
{
    protected function action(): Response
    {
        $ID = $this->resolveArg('id');
        if ($ID == 0 || $ID == null) {
            return $this->respondWithData("ID is required");
        }
        $professors = $this->professorRepository->findProfessorById($ID);
        return $this->respondWithData($professors);
    }
}
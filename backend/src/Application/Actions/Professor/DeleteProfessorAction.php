<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteProfessorAction extends ProfessorAction
{
    protected function action(): Response
    {
        $id = (string)$this->resolveArg('id');
        $success = $this->professorRepository->delete($id);

        return $this->respondWithData(['success' => $success]);
    }
}

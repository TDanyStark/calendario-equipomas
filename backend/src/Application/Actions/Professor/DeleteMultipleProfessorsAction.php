<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteMultipleProfessorsAction extends ProfessorAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $ids = $data['ids'] ?? [];

        if (empty($ids)) {
            return $this->respondWithData(['message' => 'No IDs provided'], 400);
        }

        $deletedCount = $this->professorRepository->deleteMultiple($ids);

        return $this->respondWithData(['message' => "$deletedCount profesores eliminados."]);
    }
}

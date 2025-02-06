<?php

declare(strict_types=1);

namespace App\Application\Actions\Student;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteMultipleStudentsAction extends StudentAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $ids = $data['ids'] ?? [];

        if (empty($ids)) {
            return $this->respondWithData(['message' => 'No IDs provided'], 400);
        }

        $deletedCount = $this->studentRepository->deleteMultiple($ids);

        return $this->respondWithData(['message' => "$deletedCount estudiantes eliminados."]);
    }
}

<?php

declare(strict_types=1);

namespace App\Application\Actions\Semester;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteMultipleSemestersAction extends SemesterAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $ids = $data['ids'] ?? [];

        if (empty($ids)) {
            return $this->respondWithData(['message' => 'No IDs provided'], 400);
        }

        $deletedCount = $this->semesterRepository->deleteMultiple($ids);

        return $this->respondWithData(['message' => "$deletedCount instrumentos eliminados."]);
    }
}

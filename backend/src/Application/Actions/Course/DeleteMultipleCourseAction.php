<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteMultipleCourseAction extends CourseAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $ids = $data['ids'] ?? [];

        if (empty($ids)) {
            return $this->respondWithData(['message' => 'No IDs provided'], 400);
        }

        $deletedCount = $this->courseRepository->deleteMultiple($ids);

        return $this->respondWithData(['message' => "$deletedCount instrumentos eliminados."]);
    }
}

<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteCourseAction extends CourseAction
{
    protected function action(): Response
    {
        $id = $this->resolveArg('id');

        $course = $this->courseRepository->findById($id);

        if ($course === null) {
            return $this->respondWithData(['error' => 'Course not found'], 404);
        }

        $this->courseRepository->delete($id);

        return $this->respondWithData(['message' => 'Course deleted successfully']);
    }
}

<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\Course\Course;

class UpdateCourseAction extends CourseAction
{
    protected function action(): Response
    {
        $id = (int)$this->resolveArg('id');
        $data = $this->request->getParsedBody();

        $course = $this->courseRepository->findById($id);

        if ($course === null) {
            return $this->respondWithData(['error' => 'Course not found'], 404);
        }

        // Actualizamos las propiedades del curso
        $course = new Course(
            $id,
            $data['name'] ?? $course->getName(),
            $data['description'] ?? $course->getDescription(),
            $data['isOnline'] ?? $course->getIsOnline(),
            $course->getCreatedAt(),
            $course->getUpdatedAt(),
            $course->getAvailability() // Si la disponibilidad también se actualiza, agrega la lógica aquí
        );

        $this->courseRepository->update($course);

        return $this->respondWithData(['message' => 'Course updated successfully']);
    }
}

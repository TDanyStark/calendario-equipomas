<?php
declare(strict_types=1);

namespace App\Application\Actions\Course;

use Psr\Http\Message\ResponseInterface as Response;

class UpdateCourseAction extends CourseAction
{
    protected function action(): Response
    {
        $id = $this->resolveArg('id');
        $data = $this->request->getParsedBody();

        // Buscar el curso existente
        $existingCourse = $this->courseRepository->findById($id);

        if ($existingCourse === null) {
            return $this->respondWithData(['error' => 'Course not found'], 404);
        }

        // Parsear y validar la disponibilidad
        $availabilityData = $data['availability'] ?? [];
        $availability = $this->parseAvailability($availabilityData);

        // Actualizar las propiedades del curso
        $updatedCourse = $this->buildCourse($id, $data, $availability);

        // Guardar los cambios en el repositorio
        $this->courseRepository->update($updatedCourse);

        return $this->respondWithData(['message' => 'Course updated successfully']);
    }
}


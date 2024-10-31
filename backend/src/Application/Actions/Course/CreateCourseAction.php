<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use Psr\Http\Message\ResponseInterface as Response;

class CreateCourseAction extends CourseAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();

        // Parsear y validar la disponibilidad
        $availabilityData = $data['availability'] ?? [];
        $availability = $this->parseAvailability($availabilityData);

        // Crear una instancia de Course sin ID (se genera en la base de datos)
        $course = $this->buildCourse("", $data, $availability);

        // Guardar el curso y obtener el ID generado
        $courseId = $this->courseRepository->create($course);

        return $this->respondWithData(['id' => $courseId], 201);
    }
}

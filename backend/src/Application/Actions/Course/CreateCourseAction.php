<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\Course\Course;
use App\Domain\Course\CourseAvailability;

class CreateCourseAction extends CourseAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();

        // Validamos y preparamos la disponibilidad
        $availabilityData = $data['availability'] ?? [];
        $availability = array_map(function ($item) {
            return new CourseAvailability(
                $item['dayOfWeek'],
                $item['startTime'] ?? null,
                $item['endTime'] ?? null
            );
        }, $availabilityData);

        // Creamos la instancia de Course incluyendo la disponibilidad
        $course = new Course(
            0, // El ID se genera automáticamente en la base de datos
            $data['name'],
            $data['description'] ?? null,
            $data['isOnline'],
            '', // createdAt es manejado por la base de datos
            '', // updatedAt es manejado por la base de datos
            $availability
        );

        // Guardamos el curso y obtenemos el ID generado
        $courseId = $this->courseRepository->create($course);

        return $this->respondWithData(['id' => $courseId], 201);
    }
}

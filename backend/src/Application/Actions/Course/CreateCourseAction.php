<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\Course\Course;
use App\Domain\Course\CourseAvailability;
use App\Domain\Shared\Days\DayOfWeek;
use InvalidArgumentException;

class CreateCourseAction extends CourseAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();

        // Validamos y preparamos la disponibilidad
        $availabilityData = $data['availability'] ?? [];
        $availability = array_map(function ($item) {
            try {
                // Convertimos dayOfWeek al enum DayOfWeek
                $dayOfWeek = DayOfWeek::from(strtolower($item['dayOfWeek']));
                return new CourseAvailability(
                    $dayOfWeek,
                    $item['startTime'] ?? null,
                    $item['endTime'] ?? null
                );
            } catch (\ValueError $e) {
                throw new InvalidArgumentException("Invalid dayOfWeek value: {$item['dayOfWeek']}");
            }
        }, $availabilityData);

        // Creamos la instancia de Course incluyendo la disponibilidad
        $course = new Course(
            0, // El ID se genera automáticamente en la base de datos
            $data['name'],
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

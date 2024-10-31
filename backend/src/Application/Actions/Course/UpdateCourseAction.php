<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\Course\Course;
use App\Domain\Course\CourseAvailability;
use App\Domain\Shared\Days\ScheduleDay;
use DateTime;
use InvalidArgumentException;
use App\Domain\Shared\Days\DayOfWeek;

class UpdateCourseAction extends CourseAction
{
    protected function action(): Response
    {
        $id = $this->resolveArg('id');
        $data = $this->request->getParsedBody();

        $course = $this->courseRepository->findById($id);

        if ($course === null) {
            return $this->respondWithData(['error' => 'Course not found'], 404);
        }

        $availabilityData = $data['availability'] ?? [];
        $availability = array_map(function ($item) {
            try {
                // Parsear y formatear startTime
                $startDateTime = new DateTime($item['startTime']);
                $startTime = $startDateTime->format('H:i'); // Formato 'HH:MM'

                // Parsear y formatear endTime
                $endDateTime = new DateTime($item['endTime']);
                $endTime = $endDateTime->format('H:i'); // Formato 'HH:MM'

                $scheduleDay = new ScheduleDay(
                    $item['id'],
                    DayOfWeek::from(strtolower($item['dayName'])),
                    $item['dayDisplayName'],
                    true, // es manejado por la base de datos
                    $startTime, // es manejado por la base de datos 
                    $endTime
                ); // es manejado por la base de datos

                return new CourseAvailability(
                    $item['id'],
                    $scheduleDay,
                    $startTime,
                    $endTime
                );
            } catch (\ValueError $e) {
                throw new InvalidArgumentException("Invalid dayOfWeek value: {$item['dayOfWeek']}");
            }
        }, $availabilityData);

        // Actualizamos las propiedades del curso
        $course = new Course(
            $id,
            $data['name'],
            $data['isOnline'],
            (int)$data['duration'],
            '', // createdAt es manejado por la base de datos
            '', // updatedAt es manejado por la base de datos
            $availability
        );

        $this->courseRepository->update($course);

        return $this->respondWithData(['message' => 'Course updated successfully']);
    }
}

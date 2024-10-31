<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use App\Application\Actions\Action;
use App\Domain\Course\CourseRepository;
use Psr\Log\LoggerInterface;
use DateTime;
use App\Domain\Shared\Days\ScheduleDay;
use App\Domain\Shared\Days\DayOfWeek;
use App\Domain\Course\CourseAvailability;
use InvalidArgumentException;
use App\Domain\Course\Course;


abstract class CourseAction extends Action
{
    protected CourseRepository $courseRepository;

    public function __construct(LoggerInterface $logger, CourseRepository $courseRepository)
    {
        parent::__construct($logger);
        $this->courseRepository = $courseRepository;
    }

    protected function parseAvailability(array $availabilityData): array
    {
        return array_map(function ($item) {
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
                    true, // manejado por la base de datos
                    $startTime,
                    $endTime
                );

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
    }

    /**
     * Build a Course object from data.
     *
     * @param string $id
     * @param array $data
     * @param CourseAvailability[] $availability
     * @return Course
     */
    protected function buildCourse(string $id, array $data, array $availability): Course
    {
        return new Course(
            $id,
            $data['name'],
            $data['isOnline'],
            (int)$data['duration'],
            '', // createdAt es manejado por la base de datos
            '', // updatedAt es manejado por la base de datos
            $availability
        );
    }
}

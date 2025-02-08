<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use Psr\Http\Message\ResponseInterface as Response;

class GetCoursesQueryAction extends CourseAction
{
    protected function action(): Response
    {
        $query = $this->request->getQueryParams()['q'] ?? '';
        $courses = $this->courseRepository->findCoursesByQuery($query);
        return $this->respondWithData($courses);
    }
}

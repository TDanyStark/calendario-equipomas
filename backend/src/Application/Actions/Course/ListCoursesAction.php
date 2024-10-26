<?php

declare(strict_types=1);

namespace App\Application\Actions\Course;

use Psr\Http\Message\ResponseInterface as Response;

class ListCoursesAction extends CourseAction
{
    protected function action(): Response
    {
        $courses = $this->courseRepository->findAll();
        return $this->respondWithData($courses);
    }
}

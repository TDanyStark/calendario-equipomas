<?php

declare(strict_types=1);

namespace App\Application\Actions\Student;

use Psr\Http\Message\ResponseInterface as Response;


class GetStudentsQueryAction extends StudentAction
{
    protected function action(): Response
    {
        $query = $this->request->getQueryParams()['q'] ?? '';
        $students = $this->studentRepository->findStudentsByQuery($query);

        return $this->respondWithData($students);
    }
}
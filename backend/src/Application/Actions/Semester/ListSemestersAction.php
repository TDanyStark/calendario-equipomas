<?php

declare(strict_types=1);

namespace App\Application\Actions\Semester;

use Psr\Http\Message\ResponseInterface as Response;

class ListSemestersAction extends SemesterAction
{
    protected function action(): Response
    {
        $semesters = $this->semesterRepository->findAll();
        return $this->respondWithData($semesters);
    }
}

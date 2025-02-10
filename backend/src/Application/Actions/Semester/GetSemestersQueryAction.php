<?php

declare(strict_types=1);

namespace App\Application\Actions\Semester;

use Psr\Http\Message\ResponseInterface as Response;

class GetSemestersQueryAction extends SemesterAction
{
    protected function action(): Response
    {
        $query = $this->request->getQueryParams()['q'] ?? '';
        $semesters = $this->semesterRepository->findSemesterByQuery($query);

        return $this->respondWithData($semesters);
    }
}
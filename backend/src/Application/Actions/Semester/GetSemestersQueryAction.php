<?php

declare(strict_types=1);

namespace App\Application\Actions\Semester;

use Psr\Http\Message\ResponseInterface as Response;

use App\Application\Actions\Action;


class GetSemestersQueryAction extends SemesterAction
{
    protected function action(): Response
    {
        $query = $this->request->getQueryParams()['query'] ?? '';
        $semesters = $this->semesterRepository->findSemesterByQuery($query);

        return $this->respondWithData($semesters);
    }
}
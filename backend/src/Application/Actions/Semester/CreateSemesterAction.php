<?php

declare(strict_types=1);

namespace App\Application\Actions\Semester;

use App\Domain\Semester\Semester;

use Psr\Http\Message\ResponseInterface as Response;

class CreateSemesterAction extends SemesterAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $semester = new Semester("", $data['name'], '', '');
        $id = $this->semesterRepository->create($semester);

        return $this->respondWithData(['id' => $id], 201);
    }
}

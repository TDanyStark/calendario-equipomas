<?php

declare(strict_types=1);

namespace App\Application\Actions\Semester;

use App\Domain\Semester\Semester;
use Psr\Http\Message\ResponseInterface as Response;

class UpdateSemesterAction extends SemesterAction
{
    protected function action(): Response
    {
        $id = (string)$this->resolveArg('id');
        $data = $this->request->getParsedBody();

        $semester = new Semester($id, $data['name'], '', '');
        $success = $this->semesterRepository->update($semester);

        return $this->respondWithData(['success' => $success]);
    }
}

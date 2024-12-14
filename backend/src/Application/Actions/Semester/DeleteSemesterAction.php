<?php

declare(strict_types=1);

namespace App\Application\Actions\Semester;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteSemesterAction extends SemesterAction
{
    protected function action(): Response
    {
        $id = (int)$this->resolveArg('id');
        $success = $this->semesterRepository->delete($id);

        return $this->respondWithData(['success' => $success]);
    }
}

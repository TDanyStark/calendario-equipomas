<?php

declare(strict_types=1);

namespace App\Application\Actions\Student;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteStudentAction extends StudentAction
{
    protected function action(): Response
    {
        $id = (string)$this->resolveArg('id');
        $success = $this->studentRepository->delete($id);

        return $this->respondWithData(['success' => $success]);
    }
}
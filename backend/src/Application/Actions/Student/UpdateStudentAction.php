<?php

declare(strict_types=1);

namespace App\Application\Actions\Student;

use App\Domain\Student\Student;
use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\User\User;


class UpdateStudentAction extends StudentAction
{
    protected function action(): Response
    {
        $ID = (string)$this->resolveArg('id');
        $data = $this->request->getParsedBody();

        // primero buscar si existe el estudiante
        $student = $this->studentRepository->findStudentById($ID);

        if ($student === null) {
            return $this->respondWithData(['error' => 'Student not found'], 404);
        }

        $user = new User($ID, $data['user']['email'], null, 1);
        
        $student = new Student($ID, $data['firstName'], $data['lastName'],  $data['phone'], $data['status'], $user);
        $success = $this->studentRepository->update($student);

        return $this->respondWithData(['success' => $success]);
    }
}
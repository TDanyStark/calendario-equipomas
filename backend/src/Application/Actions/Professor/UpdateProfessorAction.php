<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use App\Domain\Professor\Professor;
use App\Domain\User\User;
use Psr\Http\Message\ResponseInterface as Response;

class UpdateProfessorAction extends ProfessorAction
{
    protected function action(): Response
    {
        $id = (string)$this->resolveArg('id');
        $data = $this->request->getParsedBody();

        // primero buscar si existe el profesor
        $professor = $this->professorRepository->findProfessorById($id);

        if ($professor === null) {
            return $this->respondWithData(['error' => 'Professor not found'], 404);
        }

        $user = new User($id, $data['user']['email'], $data['user']['password'], 2);
        $professor = new Professor($id, $data['firstName'], $data['lastName'], $data['phone'], $data['status'], $user);
        $success = $this->professorRepository->update($professor);

        return $this->respondWithData(['success' => $success]);
    }
}

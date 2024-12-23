<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use App\Domain\Professor\Professor;
use App\Domain\User\User;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Logger;

class CreateProfessorAction extends ProfessorAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $ID = (string)$data['id'];
        if ($ID == null) {
            return $this->respondWithData(['error' => 'ID is required'], 400);
        }
        $user = new User($ID, $data['user']['email'], $data['user']['password'], 2);
        $professor = new Professor($ID, $data['firstName'], $data['lastName'],  $data['phone'], $data['status'], $user);

        try {
            $id = $this->professorRepository->create($professor);
            return $this->respondWithData(['id' => $id], 201);
        } catch (\DomainException $e) {
            // Manejar la excepción personalizada
            return $this->respondWithData(['error' => "Ya existe un profesor registrado con ese numero de cédula"], 400);
        } catch (\Exception $e) {
            // Manejar otras excepciones genéricas
            return $this->respondWithData(['error' => 'Error interno en el servidor'], 500);
        }
    }
}

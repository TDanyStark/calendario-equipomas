<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use App\Application\Actions\Professor\ProfessorAction;
use Psr\Http\Message\ResponseInterface as Response;
use Exception;

class SeedProfessorsAction extends ProfessorAction
{
    protected function action(): Response
    {
        try {
            $this->professorRepository->seedProfessors();
            $responseMessage = ['message' => '20 profesores insertados correctamente.'];
            $statusCode = 200;
        } catch (Exception $e) {
            $responseMessage = ['error' => $e->getMessage()];
            $statusCode = 500;
        }

        $this->response->getBody()->write(json_encode($responseMessage));
        return $this->response->withHeader('Content-Type', 'application/json')->withStatus($statusCode);
    }
}

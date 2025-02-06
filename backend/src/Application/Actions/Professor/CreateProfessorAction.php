<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use App\Domain\Professor\Professor;
use App\Domain\User\User;
use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\Professor\ProfessorInstruments;
use App\Domain\Professor\ProfessorRooms;
use App\Domain\Professor\ProfessorAvailability;

class CreateProfessorAction extends ProfessorAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $ID = (string)$data['id'];
        if ($ID == null) {
            return $this->respondWithData(['error' => 'ID is required'], 400);
        }
        // el id del rol de profesor es 2
        $user = new User($ID, $data['user']['email'], $ID, 2); // se pasa el id del profesor como contraseña, ya luego el decide cambiarla
        
        
        $professorInstrumentsArray = [];
        foreach ($data['instruments'] as $professorInstrument) {
            $professorInstrumentsArray[] = new ProfessorInstruments(0, $ID, (int)$professorInstrument['id']);
        }

        $professorRoomsArray = [];
        foreach ($data['rooms'] as $professorRoom) {
            $professorRoomsArray[] = new ProfessorRooms(0, $ID, (int)$professorRoom['id']);
        }

        $professorAvailabilityArray = [];
        foreach ($data['availability'] as $dayData) {
            if ($dayData['isActive']) {
                foreach ($dayData['hours'] as $hourData) {
                    $professorAvailabilityArray[] = new ProfessorAvailability(
                        0,
                        $ID,
                        (int)$dayData['id'],
                        $hourData['startTime'],
                        $hourData['endTime']
                    );
                }
            }
        }

        $professor = new Professor($ID, $data['firstName'], $data['lastName'],  $data['phone'], $data['status'], $user, (int)$data['hasContract'], (int)$data['timeContract'], $professorInstrumentsArray, $professorRoomsArray, $professorAvailabilityArray);

        try {
            $id = $this->professorRepository->create($professor);
            return $this->respondWithData(['id' => $id], 201);
        } catch (\DomainException $e) {
            // Manejar la excepción personalizada
            return $this->respondWithData(['error' => "Ya existe un profesor registrado con ese numero de cédula"], 400);
        } catch (\Exception $e) {
            // Manejar otras excepciones genéricas
            return $this->respondWithData(['error' => 'Error interno en el servidor', $e->getMessage()], 500);
        }
    }
}

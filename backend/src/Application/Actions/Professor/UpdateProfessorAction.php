<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use App\Domain\Professor\Professor;
use App\Domain\User\User;
use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\Professor\ProfessorInstruments;
use App\Domain\Professor\ProfessorRooms;
use App\Domain\Professor\ProfessorAvailability;

class UpdateProfessorAction extends ProfessorAction
{
    protected function action(): Response
    {
        $ID = (string)$this->resolveArg('id');
        $data = $this->request->getParsedBody();

        // primero buscar si existe el profesor
        $professor = $this->professorRepository->findProfessorById($ID);

        if ($professor === null) {
            return $this->respondWithData(['error' => 'Professor not found'], 404);
        }

        $user = new User($ID, $data['user']['email'], null, 2);
        
        // $professorInstrumentsArray = [];
        // foreach ($data['instruments'] as $professorInstrument) {
        //     $professorInstrumentsArray[] = new ProfessorInstruments(0, $ID, (int)$professorInstrument['id'], null);
        // }

        // $professorRoomsArray = [];
        // foreach ($data['rooms'] as $professorRoom) {
        //     $professorRoomsArray[] = new ProfessorRooms(0, $ID, (int)$professorRoom['id']);
        // }

        // $professorAvailabilityArray = [];
        // foreach ($data['availability'] as $dayData) {
        //     if ($dayData['isActive']) {
        //         foreach ($dayData['hours'] as $hourData) {
        //             $professorAvailabilityArray[] = new ProfessorAvailability(
        //                 0,
        //                 $ID,
        //                 (int)$dayData['id'],
        //                 $hourData['startTime'],
        //                 $hourData['endTime']
        //             );
        //         }
        //     }
        // }

        $professor = new Professor($ID, $data['firstName'], $data['lastName'],  $data['phone'], $data['status'], $user);
        $success = $this->professorRepository->update($professor);

        return $this->respondWithData(['success' => $success]);
    }
}

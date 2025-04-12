<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use App\Domain\Professor\ProfessorAvailability;
use App\Domain\Professor\ProfessorContracts;
use App\Domain\Professor\ProfessorInstruments;
use App\Domain\Professor\ProfessorRooms;
use Psr\Http\Message\ResponseInterface as Response;


class AssignProfessorAction extends ProfessorAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $ID = (string)$data['id'];
        if ($ID == null) {
            return $this->respondWithData(['error' => 'ID is required'], 400);
        }
        $academic_periodID = $this->academicPeriodRepository->getActivePeriodID();
        $professorInstrumentsArray = [];
        foreach ($data['instruments'] as $professorInstrument) {
            $professorInstrumentsArray[] = new ProfessorInstruments(0, $ID, (int)$professorInstrument['id'], $academic_periodID, null);
        }

        $professorRoomsArray = [];
        foreach ($data['rooms'] as $professorRoom) {
            $professorRoomsArray[] = new ProfessorRooms(0, $ID, (int)$professorRoom['id'], $academic_periodID);
        }

        $professorAvailabilityArray = [];
        foreach ($data['availability'] as $dayData) {
            if ($dayData['isActive']) {
                foreach ($dayData['hours'] as $hourData) {
                    $professorAvailabilityArray[] = new ProfessorAvailability(
                        0,
                        $ID,
                        (int)$dayData['id'],
                        $academic_periodID,
                        $hourData['startTime'],
                        $hourData['endTime']
                    );
                }
            }
        }

        $contract = filter_var($data['contract'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $hours = (int)$data['hours'];

        $this->logger->info("contratos $contract horas $hours");

        $professorContract = new ProfessorContracts(0, $ID, $academic_periodID, $contract, $hours, null);

        $this->professorRepository->assignProfessor($ID, $professorInstrumentsArray, $professorRoomsArray, $professorAvailabilityArray, $professorContract);

        return $this->respondWithData(['id' => $ID], 201);
    }
}
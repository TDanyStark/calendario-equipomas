<?php

declare(strict_types=1);

namespace App\Application\Actions\Enrollment;

use App\Domain\Enrollment\Enrollment;

use Psr\Http\Message\ResponseInterface as Response;

class CreateEnrollmentAction extends EnrollmentAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();

        if (!isset($data['studentID']) || !isset($data['courseID']) || !isset($data['instrumentID']) || !isset($data['status']) || !isset($data['semesterID'])) {
            return $this->respondWithData(['error' => 'Missing required fields'], 400);
        }

        $academic_periodID = $this->academicPeriodRepository->getActivePeriodID();

        $enrollment = new Enrollment(
            "",
            (string) $data['studentID'],
            (string) $data['courseID'],
            (string) $data['semesterID'],
            (string) $data['instrumentID'],
            $academic_periodID,
            $data['status'],
            $data['studentName'] ?? null,
            $data['courseName'] ?? null,
            $data['semesterName'] ?? null,
            $data['instrumentName'] ?? null,
            null,
        );

        try {
            $id = $this->enrollmentRepository->create($enrollment);
            return $this->respondWithData(['id' => $id], 201);
        } catch (\DomainException $e) {
            return $this->respondWithData(['error' => "Ya existe una inscripción registrada con este estudiante"], 400);
        } catch (\Exception $e) {
            return $this->respondWithData(['error' => 'Error interno en el servidor', $e->getMessage()], 500);
        }
    }
}

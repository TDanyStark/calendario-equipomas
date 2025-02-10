<?php

declare(strict_types=1);

namespace App\Application\Actions\Enrollments;

use App\Domain\Enrollments\Enrollment;

use Psr\Http\Message\ResponseInterface as Response;

class CreateEnrollAction extends EnrollmentsAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();

        if (!isset($data['studentID']) || !isset($data['courseID']) || !isset($data['instrumentID']) || !isset($data['status'])) {
            return $this->respondWithData(['error' => 'Missing required fields'], 400);
        }

        $enrollment = new Enrollment(
            "",
            $data['studentID'],
            $data['courseID'],
            $data['instrumentID'],
            $data['status'],
            $data['studentName'] ?? null,
            $data['courseName'] ?? null,
            $data['instrumentName'] ?? null
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

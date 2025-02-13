<?php

declare(strict_types=1);

namespace App\Application\Actions\Enrollment;

use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\Enrollment\Enrollment;

class UpdateEnrollmentAction extends EnrollmentAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $id = $this->resolveArg('id');

        if (!isset($data['studentID']) || !isset($data['courseID']) || !isset($data['instrumentID']) || !isset($data['status']) || !isset($data['semesterID'])) {
            return $this->respondWithData(['error' => 'Missing required fields'], 400);
        }

        $enrollment = new Enrollment(
            $id,
            $data['studentID'],
            $data['courseID'],
            $data['semesterID'],
            $data['instrumentID'],
            "",
            $data['status'],
            $data['studentName'] ?? null,
            $data['courseName'] ?? null,
            $data['semesterName'] ?? null,
            $data['instrumentName'] ?? null,
            null
        );

        try {
            $updated = $this->enrollmentRepository->update($enrollment);
            if (!$updated) {
                return $this->respondWithData(['error' => 'Failed to update enrollment'], 500);
            }
            return $this->respondWithData(['message' => 'Enrollment updated successfully']);
        } catch (\DomainException $e) {
            return $this->respondWithData(['error' => 'Enrollment not found'], 404);
        } catch (\Exception $e) {
            return $this->respondWithData(['error' => 'Error interno en el servidor', $e->getMessage()], 500);
        }
    }
}

<?php

declare(strict_types=1);

namespace App\Application\Actions\Enrollment;

use Psr\Http\Message\ResponseInterface as Response;


class UpdateGroupAction extends EnrollmentAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $changeTo = $data['option'] ?? null;

        if (!$changeTo || $changeTo !== 'inactivo' && $changeTo !== 'activo') {
          return $this->respondWithData(['error' => 'Missing required fields'], 400);
        }

        // coger los parametros por URL
        $query = $this->request->getQueryParams()['query'] ?? '';
        $courseID = $this->request->getQueryParams()['course'] ?? '';
        $instrumentID = $this->request->getQueryParams()['instrument'] ?? '';
        $semesterID = $this->request->getQueryParams()['semester'] ?? '';

        $updated = $this->enrollmentRepository->updateByGroup($changeTo, $query, $courseID, $instrumentID, $semesterID);

        return $this->respondWithData(['message' => 'Group updated successfully', 'rowUpdate' => $updated]);
    }
}
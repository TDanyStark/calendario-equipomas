<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use App\Domain\GroupClass\GroupClass;
use Psr\Http\Message\ResponseInterface as Response;
class CreateGroupClassAction extends GroupClassAction
{
  protected function action(): Response
    {
      $data = $this->request->getParsedBody();
      $academic_periodID = $this->academicPeriodRepository->getActivePeriodID();

      $groupClass = new GroupClass(
        0,
        $data['name'],
        $data['roomId'],
        $academic_periodID,
        $data['dayId'],
        $data['startTime'],
        $data['endTime'],
        $data['professors'] ?? null,
        $data['enrollments'] ?? null
      );

      $this->groupClassRepository->create($groupClass);

      return $this->respondWithData(['message' => 'Instrument created successfully'], 201);
    }
}
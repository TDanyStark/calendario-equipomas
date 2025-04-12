<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use Psr\Http\Message\ResponseInterface as Response;

class ListOnlyAssignIdsActiveAction extends ProfessorAction
{
  /**
   * {@inheritdoc}
   */
  protected function action(): Response
  {
    $academic_periodID = $this->academicPeriodRepository->getActivePeriodID();
    $professorIds = $this->professorRepository->findOnlyAssignIdsActive($academic_periodID);
    return $this->respondWithData($professorIds);
  }
}
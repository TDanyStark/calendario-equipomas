<?php

declare(strict_types=1);

namespace App\Application\Actions\Professor;

use Psr\Http\Message\ResponseInterface as Response;

class GetAssignProfessorAction extends ProfessorAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $academic_periodID = (int)$this->academicPeriodRepository->getActivePeriodID();
        $params = $this->request->getQueryParams();
        $page = isset($params['page']) ? (int) $params['page'] : 1;
        $query = isset($params['query']) ? (string)$params['query'] : '';
        $offPagination = isset($params['offPagination']) ? filter_var($params['offPagination'], FILTER_VALIDATE_BOOLEAN) : false;
        $onlyWithAssignments = isset($params['onlyWithAssignments']) ? filter_var($params['onlyWithAssignments'], FILTER_VALIDATE_BOOLEAN) : false;
        // Calcula el offset y el límite
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $professorWithAssign = $this->professorRepository->getProfessorsWithAssign($academic_periodID, $limit, $offset, $query, $offPagination, $onlyWithAssignments);
        return $this->respondWithData($professorWithAssign);
    }
}
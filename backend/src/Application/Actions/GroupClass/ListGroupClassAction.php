<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use Psr\Http\Message\ResponseInterface as Response;

class ListGroupClassAction extends GroupClassAction
{
    protected function action(): Response
    {
        $groupClasses = $this->groupClassRepository->findAll();

        return $this->respondWithData($groupClasses);
    }
}
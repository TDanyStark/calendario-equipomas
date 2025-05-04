<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use Psr\Http\Message\ResponseInterface as Response;

class GetGroupClassAction extends GroupClassAction
{
    protected function action(): Response
    {
        $id = (int) $this->resolveArg('id');
        
        $groupClass = $this->groupClassRepository->findById($id);
        
        if (!$groupClass) {
            return $this->respondWithData([
                'error' => true,
                'message' => "Class with ID {$id} not found."
            ], 404);
        }
        
        return $this->respondWithData($groupClass);
    }
}
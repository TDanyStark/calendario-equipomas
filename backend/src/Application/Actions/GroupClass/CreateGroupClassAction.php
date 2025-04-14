<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use Psr\Http\Message\ResponseInterface as Response;
class CreateGroupClassAction extends GroupClassAction
{
  protected function action(): Response
    {
      $data = $this->request->getParsedBody();
      $this->groupClassRepository->create($data);

      return $this->respondWithData(['message' => 'Instrument created successfully'], 201);
    }
}
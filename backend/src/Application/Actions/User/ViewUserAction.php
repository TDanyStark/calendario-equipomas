<?php

declare(strict_types=1);

namespace App\Application\Actions\User;

use Psr\Http\Message\ResponseInterface as Response;

class ViewUserAction extends UserAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $userId = (string) $this->resolveArg('id');
        $user = $this->userRepository->findUserById($userId);

        return $this->respondWithData($user);
    }
}

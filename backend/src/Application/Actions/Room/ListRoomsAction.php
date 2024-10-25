<?php

declare(strict_types=1);

namespace App\Application\Actions\Room;

use Psr\Http\Message\ResponseInterface as Response;

class ListRoomsAction extends RoomAction
{
    protected function action(): Response
    {
        $rooms = $this->roomRepository->findAll();
        return $this->respondWithData($rooms);
    }
}

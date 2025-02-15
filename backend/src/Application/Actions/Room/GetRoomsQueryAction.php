<?php

declare(strict_types=1);

namespace App\Application\Actions\Room;
use Psr\Http\Message\ResponseInterface as Response;


class GetRoomsQueryAction extends RoomAction
{
    protected function action(): Response
    {
        $query = $this->request->getQueryParams()['q'] ?? '';
        $rooms = $this->roomRepository->findRoomByQuery($query);
        return $this->respondWithData($rooms);
    }
}
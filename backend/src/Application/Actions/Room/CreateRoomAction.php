<?php

declare(strict_types=1);

namespace App\Application\Actions\Room;

use App\Domain\Room\Room;

use Psr\Http\Message\ResponseInterface as Response;

class CreateRoomAction extends RoomAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $room = new Room(0, $data['name'], $data['capacity'], '', '');
        $id = $this->roomRepository->create($room);

        return $this->respondWithData(['id' => $id], 201);
    }
}

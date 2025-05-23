<?php

declare(strict_types=1);

namespace App\Application\Actions\Room;

use App\Domain\Room\Room;
use Psr\Http\Message\ResponseInterface as Response;

class UpdateRoomAction extends RoomAction
{
    protected function action(): Response
    {
        $id = (string)$this->resolveArg('id');
        $data = $this->request->getParsedBody();

        $room = new Room($id, $data['name'], $data['capacity'], '', '');
        $success = $this->roomRepository->update($room);

        return $this->respondWithData(['success' => $success]);
    }
}

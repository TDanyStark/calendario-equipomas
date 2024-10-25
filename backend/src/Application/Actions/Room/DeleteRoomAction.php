<?php

declare(strict_types=1);

namespace App\Application\Actions\Room;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteRoomAction extends RoomAction
{
    protected function action(): Response
    {
        $id = (int)$this->resolveArg('id');
        $success = $this->roomRepository->delete($id);

        return $this->respondWithData(['success' => $success]);
    }
}

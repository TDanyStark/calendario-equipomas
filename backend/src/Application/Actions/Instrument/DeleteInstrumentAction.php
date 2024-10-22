<?php

declare(strict_types=1);

namespace App\Application\Actions\Instrument;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteInstrumentAction extends InstrumentAction
{
    protected function action(): Response
    {
        $id = $this->resolveArg('id');
        $this->instrumentRepository->delete($id);
        return $this->respondWithData(['message' => 'Instrument deleted successfully']);
    }
}

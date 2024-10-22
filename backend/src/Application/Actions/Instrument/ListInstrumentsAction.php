<?php

declare(strict_types=1);

namespace App\Application\Actions\Instrument;

use Psr\Http\Message\ResponseInterface as Response;

class ListInstrumentsAction extends InstrumentAction
{
    protected function action(): Response
    {
        $instruments = $this->instrumentRepository->findAll();
        return $this->respondWithData($instruments);
    }
}

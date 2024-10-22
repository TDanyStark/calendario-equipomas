<?php

declare(strict_types=1);

namespace App\Application\Actions\Instrument;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Domain\Instrument\Instrument;

class CreateInstrumentAction extends InstrumentAction
{
    protected function action(): Response
    {
        $data = $this->request->getParsedBody();
        $instrument = new Instrument($data['InstrumentID'], $data['InstrumentName'], '', '');
        $this->instrumentRepository->create($instrument);

        return $this->respondWithData(['message' => 'Instrument created successfully']);
    }
}

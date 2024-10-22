<?php

declare(strict_types=1);

namespace App\Application\Actions\Instrument;

use Psr\Http\Message\ResponseInterface as Response;

class UpdateInstrumentAction extends InstrumentAction
{
    protected function action(): Response
    {
        $id = $this->resolveArg('id');
        $data = $this->request->getParsedBody();
        $instrument = $this->instrumentRepository->findById($id);

        if ($instrument) {
            $instrument->setInstrumentName($data['InstrumentName']);
            $this->instrumentRepository->update($id, $instrument);
            return $this->respondWithData(['message' => 'Instrument updated successfully']);
        }

        return $this->respondWithData(['message' => 'Instrument not found'], 404);
    }
}

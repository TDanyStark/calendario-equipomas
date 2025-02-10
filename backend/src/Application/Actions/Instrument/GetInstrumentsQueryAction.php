<?php

declare(strict_types=1);

namespace App\Application\Actions\Instrument;
use Psr\Http\Message\ResponseInterface as Response;



class GetInstrumentsQueryAction extends InstrumentAction
{
    protected function action(): Response
    {
        $query = $this->request->getQueryParams()['q'] ?? '';
        $instruments = $this->instrumentRepository->findInstrumentByQuery($query);

        return $this->respondWithData($instruments);
    }
}
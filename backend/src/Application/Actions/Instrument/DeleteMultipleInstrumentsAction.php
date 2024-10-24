<?php

declare(strict_types=1);

namespace App\Application\Actions\Instrument;

use Psr\Http\Message\ResponseInterface as Response;

class DeleteMultipleInstrumentsAction extends InstrumentAction
{

    protected function action(): Response
    {
        // Obtén los IDs desde el cuerpo de la solicitud (JSON)
        $data = $this->request->getParsedBody();
        $ids = $data['ids'] ?? [];

        if (empty($ids)) {
            return $this->respondWithData(['message' => 'No IDs provided'], 400);
        }

        // Llama al método en el repositorio para eliminar los instrumentos
        $deletedCount = $this->instrumentRepository->deleteMultiple($ids);

        return $this->respondWithData(['message' => "$deletedCount instrumentos eliminados."]);
    }
}

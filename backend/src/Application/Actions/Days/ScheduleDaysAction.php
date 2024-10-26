<?php

declare(strict_types=1);

namespace App\Application\Actions\Days;

use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\Shared\Days\ScheduleDayRepository;
use App\Application\Actions\Action;
use Psr\Log\LoggerInterface;

class ScheduleDaysAction extends Action
{
    private ScheduleDayRepository $scheduleDayRepository;

    public function __construct(
        LoggerInterface $logger,
        ScheduleDayRepository $scheduleDayRepository
    ) {
        parent::__construct($logger);
        $this->scheduleDayRepository = $scheduleDayRepository;
    }

    protected function action(): Response
    {
        // Obtener los horarios de cada día de la semana
        $scheduleDays = $this->scheduleDayRepository->findAll();

        // Responder con los horarios de los días
        return $this->respondWithData($scheduleDays);
    }
}

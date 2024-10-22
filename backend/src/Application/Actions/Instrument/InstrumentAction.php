<?php

declare(strict_types=1);

namespace App\Application\Actions\Instrument;

use App\Application\Actions\Action;
use App\Domain\Instrument\InstrumentRepository;
use Psr\Log\LoggerInterface;

abstract class InstrumentAction extends Action
{
    protected InstrumentRepository $instrumentRepository;

    public function __construct(LoggerInterface $logger, InstrumentRepository $instrumentRepository)
    {
        parent::__construct($logger);
        $this->instrumentRepository = $instrumentRepository;
    }
}

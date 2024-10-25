<?php

declare(strict_types=1);

namespace App\Application\Actions\Room;

use App\Application\Actions\Action;
use App\Domain\Room\RoomRepository;
use Psr\Log\LoggerInterface;

abstract class RoomAction extends Action
{
    protected RoomRepository $roomRepository;

    public function __construct(LoggerInterface $logger, RoomRepository $roomRepository)
    {
        parent::__construct($logger);
        $this->roomRepository = $roomRepository;
    }
}

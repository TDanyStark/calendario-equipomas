<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use App\Application\Actions\Action;
use App\Domain\GroupClass\GroupClassRepository;
use Psr\Log\LoggerInterface;

abstract class GroupClassAction extends Action
{
    protected GroupClassRepository $groupClassRepository;

    public function __construct(LoggerInterface $logger, GroupClassRepository $groupClassRepository)
    {
        parent::__construct($logger);
        $this->groupClassRepository = $groupClassRepository;
    }
}
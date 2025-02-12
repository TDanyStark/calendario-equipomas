<?php

declare(strict_types=1);

namespace App\Application\Actions\AcademicPeriod;

use App\Application\Actions\Action;
use App\Domain\AcademicPeriod\AcademicPeriodRepository;
use Psr\Log\LoggerInterface;
use App\Domain\Shared\Settings\SettingRepository;

abstract class AcademicPeriodAction extends Action
{
    protected AcademicPeriodRepository $academicPeriodRepository;
    protected SettingRepository $settingRepository;

    public function __construct(LoggerInterface $logger, AcademicPeriodRepository $academicPeriodRepository, SettingRepository $settingRepository)
    {
        parent::__construct($logger);
        $this->academicPeriodRepository = $academicPeriodRepository;
        $this->settingRepository = $settingRepository;
    }
}

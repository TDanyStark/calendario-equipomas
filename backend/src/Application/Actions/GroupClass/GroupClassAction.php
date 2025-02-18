<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use App\Application\Actions\Action;
use App\Domain\GroupClass\GroupClassRepository;
use Psr\Log\LoggerInterface;

use App\Domain\AcademicPeriod\AcademicPeriodRepository;
use App\Domain\Shared\Days\ScheduleDayRepository;
use App\Domain\Shared\Settings\SettingRepository;


abstract class GroupClassAction extends Action
{
    protected GroupClassRepository $groupClassRepository;
    protected AcademicPeriodRepository $academicPeriodRepository;
    protected ScheduleDayRepository $scheduleDayRepository;
    protected SettingRepository $settingRepository;

    public function __construct(
        LoggerInterface $logger, 
        GroupClassRepository $groupClassRepository, 
        AcademicPeriodRepository $academicPeriodRepository, 
        ScheduleDayRepository $scheduleDayRepository,
        SettingRepository $settingRepository
        )
    {
        parent::__construct($logger);
        $this->groupClassRepository = $groupClassRepository;
        $this->academicPeriodRepository = $academicPeriodRepository;
        $this->scheduleDayRepository = $scheduleDayRepository;
        $this->settingRepository = $settingRepository;
    }
}

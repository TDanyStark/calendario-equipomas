<?php

declare(strict_types=1);

namespace App\Application\Actions\Days;

use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\Shared\Days\ScheduleDayRepository;
use App\Application\Actions\Action;
use Psr\Log\LoggerInterface;
use App\Domain\Shared\Settings\SettingRepository;
use App\Domain\AcademicPeriod\AcademicPeriodRepository;

class ScheduleDaysAction extends Action
{
    private ScheduleDayRepository $scheduleDayRepository;
    private SettingRepository $settingRepository;
    private AcademicPeriodRepository $academicPeriodRepository;

    public function __construct(
        LoggerInterface $logger,
        ScheduleDayRepository $scheduleDayRepository,
        SettingRepository $settingRepository,
        AcademicPeriodRepository $academicPeriodRepository
    ) {
        parent::__construct($logger);
        $this->scheduleDayRepository = $scheduleDayRepository;
        $this->settingRepository = $settingRepository;
        $this->academicPeriodRepository = $academicPeriodRepository;
    }

    protected function action(): Response
    {
        // Obtener los horarios de cada día de la semana
        $scheduleDays = $this->scheduleDayRepository->findAll();
        $recurrence = $this->settingRepository->findSetting('recurrence');

        $data = [
            'scheduleDays' => $scheduleDays,
            'recurrence' => (int)$recurrence->getValue(),
        ];

        return $this->respondWithData($data);
    }
}

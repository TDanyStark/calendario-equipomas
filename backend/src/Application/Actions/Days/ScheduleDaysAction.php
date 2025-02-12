<?php

declare(strict_types=1);

namespace App\Application\Actions\Days;

use Psr\Http\Message\ResponseInterface as Response;
use App\Domain\Shared\Days\ScheduleDayRepository;
use App\Application\Actions\Action;
use Psr\Log\LoggerInterface;
use App\Domain\Shared\Settings\SettingRepository;

class ScheduleDaysAction extends Action
{
    private ScheduleDayRepository $scheduleDayRepository;
    private SettingRepository $settingRepository;

    public function __construct(
        LoggerInterface $logger,
        ScheduleDayRepository $scheduleDayRepository,
        SettingRepository $settingRepository
    ) {
        parent::__construct($logger);
        $this->scheduleDayRepository = $scheduleDayRepository;
        $this->settingRepository = $settingRepository;
    }

    protected function action(): Response
    {
        // Obtener los horarios de cada día de la semana
        $scheduleDays = $this->scheduleDayRepository->findAll();
        $recurrence = $this->settingRepository->findSetting('recurrence');
        $activeSemesterID = $this->settingRepository->findSetting('activeSemesterID');



        $data = [
            'scheduleDays' => $scheduleDays,
            'recurrence' => (int)$recurrence->getValue(),
            'activeSemester' => (string)$activeSemesterID->getValue()
        ];

        return $this->respondWithData($data);
    }
}

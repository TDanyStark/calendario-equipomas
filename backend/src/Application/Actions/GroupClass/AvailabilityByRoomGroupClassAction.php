<?php

declare(strict_types=1);

namespace App\Application\Actions\GroupClass;

use Psr\Http\Message\ResponseInterface as Response;

class AvailabilityByRoomGroupClassAction extends GroupClassAction
{
    protected function action(): Response
    {
        $roomId = (int) ($this->request->getQueryParams()['roomId'] ?? null);
        $IdGroupClassEdit = (int) ($this->request->getQueryParams()['idGroupClassEdit'] ?? null);
        if ($roomId === null || $roomId === "" || $roomId === 0) {
            return $this->respondWithData(['error' => 'Room ID is required']);
        }

        $academic_periodID = $this->academicPeriodRepository->getActivePeriodID();

        $groupClassBusy = $this->groupClassRepository->findAvailabilityByRoom($roomId, $academic_periodID);
        // quitar de groupClassBusy el elementor con IdGroupClassEdit
        if ($IdGroupClassEdit) {
            $groupClassBusy = array_filter($groupClassBusy, function ($class) use ($IdGroupClassEdit) {
                return $class->getId() !== $IdGroupClassEdit;
            });
        }
        $systemAvailability = $this->scheduleDayRepository->findAll();

        $availableSlots = $this->calculateAvailability($systemAvailability, $groupClassBusy);
        $recurrence = $this->settingRepository->findSetting('recurrence');

        $data = [
            'availableSlots' => $availableSlots,
            'recurrence' => (int)$recurrence->getValue(),
        ];

        return $this->respondWithData($data);
    }

    private function calculateAvailability(array $systemAvailability, array $groupClassBusy): array
    {
        $availability = [];
    
        // Convertir systemAvailability a intervalos disponibles
        foreach ($systemAvailability as $day) {
            $dayId = (int) $day->getDayId();
            $availability[$dayId] = [
                "dayDisplayName" => $day->getDayDisplayName(),
                "dayName" => $day->getDayName(),
                "id" => $dayId,
                "slots" => [
                    [
                        'start' => strtotime($day->getStartTime()),
                        'end' => strtotime($day->getEndTime()),
                    ]
                ],
            ];
        }
    
        // Restar los intervalos ocupados (groupClassBusy)
        foreach ($groupClassBusy as $class) {
            $dayId = (int) $class->getDayId();
            $startTime = strtotime($class->getStartTime());
            $endTime = strtotime($class->getEndTime());
    
            if (!isset($availability[$dayId])) {
                continue;
            }
    
            $newSlots = [];
            foreach ($availability[$dayId]['slots'] as $slot) {
                if ($startTime > $slot['end'] || $endTime < $slot['start']) {
                    $newSlots[] = $slot;
                } else {
                    if ($startTime > $slot['start']) {
                        $newSlots[] = ['start' => $slot['start'], 'end' => $startTime];
                    }
                    if ($endTime < $slot['end']) {
                        $newSlots[] = ['start' => $endTime, 'end' => $slot['end']];
                    }
                }
            }
            $availability[$dayId]['slots'] = $newSlots;
        }
        
        // Ordenar los slots por hora de inicio
        foreach ($availability as $dayId => &$dayData) {
            if (!isset($dayData['slots']) || !is_array($dayData['slots']) || empty($dayData['slots'])) {
                continue;
            }
            
            usort($dayData['slots'], function($a, $b) {
                return $a['start'] <=> $b['start'];
            });
        }
    
        // Convertir los timestamps a formato "H:i:s"
        foreach ($availability as $dayId => &$dayData) {
            if (!isset($dayData['slots']) || !is_array($dayData['slots'])) {
                continue;
            }
            foreach ($dayData['slots'] as &$slot) {
                $slot['start'] = date('H:i:s', $slot['start']);
                $slot['end'] = date('H:i:s', $slot['end']);
            }
        }
        unset($dayData, $slot); // Evitar referencias accidentales
    
        // Convertir de array asociativo a indexado
        return array_values($availability);
    }
}

<?php

declare(strict_types=1);

namespace App\Application\Actions\AcademicPeriod;

use App\Domain\AcademicPeriod\AcademicPeriod;
use Psr\Http\Message\ResponseInterface as Response;


class CreateAcademicPeriodAction extends AcademicPeriodAction
{
    /**
     * {@inheritdoc}
     */
    protected function action(): Response
    {
        $data = $this->getFormData();

        $year = $data['year'];
        $semester = $data['semester'];

        // Calcular fechas de inicio y fin
        $startDate = $this->calculateStartDate($year, $semester);
        $endDate = $this->calculateEndDate($year, $semester);
        $selected = 1;

        try {
            $academicPeriod = new AcademicPeriod(
                null,
                $year,
                $semester,
                $selected,
                $startDate,
                $endDate
            );

            $academicPeriod = $this->academicPeriodRepository->create($academicPeriod);

            return $this->respondWithData($academicPeriod);
        } catch (\DomainException $e) {
            return $this->respondWithData(['error' => $e->getMessage()], 400);
        }
    }

    private function calculateStartDate(int $year, int $semester): string
    {
        $startDate = '';
        if ($semester === 1) {
            $startDate = $year . '-01-01';
        } else if ($semester === 2) {
            $startDate = $year . '-07-01';
        }

        return $startDate;
    }

    private function calculateEndDate(int $year, int $semester): string
    {
        $endDate = '';
        if ($semester === 1) {
            $endDate = $year . '-06-30';
        } else if ($semester === 2) {
            $endDate = $year . '-12-31';
        }

        return $endDate;
    }
}

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

        // validar que el año no sea menor al actual y el semestre solo sea 1 y 2
        if ($year < date('Y') || ($semester !== 1 && $semester !== 2)) {
            return $this->respondWithData(['error' => 'Invalid year or semester'], 400);
        }

        // calculate the start and end date of the academic period
        $startDate = $this->calculateStartDate($year, $semester);
        $endDate = $this->calculateEndDate($year, $semester);
        $selected = 1;

        $academicPeriod = new AcademicPeriod(
            "",
            $data['year'],
            $data['semester'],
            $selected,
            $startDate,
            $endDate
        );

        $academicPeriod = $this->academicPeriodRepository->create($academicPeriod);

        return $this->respondWithData($academicPeriod);
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
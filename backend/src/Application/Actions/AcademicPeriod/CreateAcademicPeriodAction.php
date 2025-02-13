<?php

declare(strict_types=1);

namespace App\Application\Actions\AcademicPeriod;

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

        // calculate the start and end date of the academic period
        $startDate = $this->calculateStartDate($year, $semester);
        $endDate = $this->calculateEndDate($year, $semester);

        $academicPeriod = $this->academicPeriodRepository->create($data);

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
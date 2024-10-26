<?php

declare(strict_types=1);

namespace App\Domain\Shared\Days;

use App\Domain\Shared\Days\ScheduleDay;

interface ScheduleDayRepository
{
    /**
     * Obtiene todos los días de la semana con sus horarios.
     *
     * @return ScheduleDay[] Arreglo de objetos ScheduleDay.
     */
    public function findAll(): array;
}

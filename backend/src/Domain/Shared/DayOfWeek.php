<?php

namespace App\Domain\Shared;

enum DayOfWeek: string
{
    case monday = 'monday';
    case tuesday = 'tuesday';
    case wednesday = 'wednesday';
    case thursday = 'thursday';
    case friday = 'friday';
    case saturday = 'saturday';
    case sunday = 'sunday';
}

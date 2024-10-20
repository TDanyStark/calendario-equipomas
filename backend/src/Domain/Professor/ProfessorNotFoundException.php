<?php

declare(strict_types=1);

namespace App\Domain\Professor;

use DomainException;

class ProfessorNotFoundException extends DomainException
{
    public function __construct()
    {
        parent::__construct('The professor you requested does not exist.');
    }
}

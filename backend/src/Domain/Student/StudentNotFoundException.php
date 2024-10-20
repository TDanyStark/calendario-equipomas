<?php

declare(strict_types=1);

namespace App\Domain\Student;

use DomainException;

class StudentNotFoundException extends DomainException
{
    public function __construct()
    {
        parent::__construct('The Student you requested does not exist.');
    }
}

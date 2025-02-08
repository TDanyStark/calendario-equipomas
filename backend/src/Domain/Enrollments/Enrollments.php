<?php

declare(strict_types=1);

namespace App\Domain\Enrollments;

use JsonSerializable;

class Enrollment implements JsonSerializable
{
    private string $enrollmentID;

    private string $studentID;
    private string $studentName;
    private string $courseID;
    private string $courseName;
    private string $instrumentID;
    private string $instrumentName;
    private string $status;
    private string $enrollmentDate;

    public function __construct(
        string $enrollmentID,
        string $studentID,
        string $studentName,
        string $courseID,
        string $courseName,
        string $instrumentID,
        string $instrumentName,
        string $status,
        string $enrollmentDate
    ) {
        $this->enrollmentID = $enrollmentID;
        $this->studentID = $studentID;
        $this->studentName = $studentName;
        $this->courseID = $courseID;
        $this->courseName = $courseName;
        $this->instrumentID = $instrumentID;
        $this->instrumentName = $instrumentName;
        $this->status = $status;
        $this->enrollmentDate = $enrollmentDate;
    }

    public function getEnrollmentID(): string
    {
        return $this->enrollmentID;
    }

    public function getStudentID(): string
    {
        return $this->studentID;
    }

    public function getStudentName(): string
    {
        return $this->studentName;
    }

    public function getCourseID(): string
    {
        return $this->courseID;
    }

    public function getCourseName(): string
    {
        return $this->courseName;
    }

    public function getInstrumentID(): string
    {
        return $this->instrumentID;
    }

    public function getInstrumentName(): string
    {
        return $this->instrumentName;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getEnrollmentDate(): string
    {
        return $this->enrollmentDate;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->enrollmentID,
            'studentID' => $this->studentID,
            'studentName' => $this->studentName,
            'courseID' => $this->courseID,
            'courseName' => $this->courseName,
            'instrumentID' => $this->instrumentID,
            'instrumentName' => $this->instrumentName,
            'status' => $this->status,
            'enrollmentDate' => $this->enrollmentDate,
        ];
    }
    
}
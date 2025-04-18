<?php

declare(strict_types=1);

namespace App\Domain\Enrollment;

use JsonSerializable;

class Enrollment implements JsonSerializable
{
    private string $enrollmentID;

    private string $studentID;
    private string $courseID;
    private string $semesterID;
    private string $instrumentID;
    private int $academic_periodID;
    private string $status;
    private ?string $studentName;
    private ?string $courseName;
    private ?string $semesterName;
    private ?string $instrumentName;
    private ?string $academicPeriodName;

    public function __construct(
        string $enrollmentID,
        string $studentID,
        string $courseID,
        string $semesterID,
        string $instrumentID,
        int $academic_periodID,
        string $status,
        ?string $studentName,
        ?string $courseName,
        ?string $semesterName,
        ?string $instrumentName,
        ?string $academicPeriodName
    ) {
        $this->enrollmentID = $enrollmentID;
        $this->studentID = $studentID;
        $this->courseID = $courseID;
        $this->semesterID = $semesterID;
        $this->instrumentID = $instrumentID;
        $this->academic_periodID = $academic_periodID;
        $this->status = $status;
        $this->studentName = $studentName;
        $this->courseName = $courseName;
        $this->semesterName = $semesterName;
        $this->instrumentName = $instrumentName;
        $this->academicPeriodName = $academicPeriodName;
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

    public function getSemesterID(): string
    {
        return $this->semesterID;
    }

    public function getSemesterName(): string
    {
        return $this->semesterName;
    }

    public function getAcademicPeriodID(): int
    {
        return $this->academic_periodID;
    }

    public function getAcademicPeriodName(): string
    {
        return $this->academicPeriodName;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->enrollmentID,
            'studentID' => $this->studentID,
            'studentName' => $this->studentName,
            'courseID' => $this->courseID,
            'courseName' => $this->courseName,
            'semesterID' => $this->semesterID,
            'semesterName' => $this->semesterName,
            'instrumentID' => $this->instrumentID,
            'instrumentName' => $this->instrumentName,
            'academicPeriodID' => $this->academic_periodID,
            'academicPeriodName' => $this->academicPeriodName,
            'status' => $this->status,
        ];
    }
    
}
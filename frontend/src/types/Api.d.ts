// types/Api.d.ts
export type DayOfWeekNameType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type ResourceType = 'instruments' | 'rooms' | 'courses' | 'semesters' | 'professors' | 'students' | 'enrolls' | 'academic-periods';

interface Availability {
  startTime: string;
  endTime: string;
}
interface ScheduleType {
  isActive: boolean;
  id: string;
  dayName: string;
  dayDisplayName: string;
  hours: Availability[];
}

type ScheduleDayType = {
  id: string;
  dayName: DayOfWeekNameType;
  dayDisplayName: string;
  startTime: string;
  endTime: string;
};

interface SelectScheduleType {
  id: string;
  dayName: DayOfWeekNameType;
  dayDisplayName: string;
  startTime: string;
  endTime: string;
  isSelected: boolean;
  isOptionsOpen: boolean;
  activeTimeType: "start" | "end" | null;
}

interface ScheduleStateType {
  scheduleDays: ScheduleDayType[] | null;
  recurrence: number | null;
  academicPeriod: AcademicPeriodType | null;
}

interface AcademicPeriodType {
  id: string;
  year: number;
  semester: number;
  startDate: string;
  endDate: string;
}

export interface Selectable {
  selected: boolean;
  [key: string]: unknown;
}


export interface InstrumentType {
  id: string;
  name: string;
}

export interface RoomType {
  id: string;
  name: string;
  capacity: ?number;
};

type SelectableInstrument = InstrumentType & Selectable;
type SelectableRoom = RoomType & Selectable;


type CourseType = {
  id: string;
  name: string;
  isOnline: boolean;
  duration: number;
  availability: SelectScheduleType[];
};

type TestType = {
  id: string;
  name: string; 
  isOnline: boolean;
  duration: number;
};

type SemesterType = {
  id: string;
  name: string;
}

type ProfessorAvailabilityType = {
  availabilityID: number;
  professorID: string;
  dayID: string;
  startTime: string;
  endTime: string;
}

type ProfessorInstrumentType = {
  ProfessorInstrumentID: number;
  id: string;
}

type ProfessorRoomType = {
  ProfessorRoomID: number;
  id: string;
}

type ProfessorType ={
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  hasContract: boolean;
  timeContract: string;
  user: {
    email: string;
    roleID: string;
  };
  availability: ProfessorAvailabilityType[] | ScheduleType[];
  instruments: ProfessorInstrumentType[] | SelectableInstrument[];
  rooms: ProfessorRoomType[] | SelectableRoom[];
}

type StudentType = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  user: {
    email: string;
    roleID: string;
  };
}

type EnrollType = {
  id: string;
  studentID: string;
  studentName: string;
  courseID: string;
  courseName: string;
  semesterID: string;
  semesterName: string;
  instrumentID: string;
  instrumentName: string;
  academicPeriodID: string;
  academicPeriodName: string;
  status: string;
}
// types/Api.d.ts
export type DayOfWeekNameType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type ResourceType = 'instruments' | 'rooms' | 'courses' | 'semesters' | 'professors' | 'students' | 'enrolls' | 'academic-periods' | 'groupclass' | 'professors/assign' | 'professors/only/assign';

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
}

interface AcademicPeriodType {
  id: number;
  year: number;
  semester: number;
  selected: number;
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

type AvailabilityForScheduleProType = {
  dayID: string;
  startTime: string;
  endTime: string;
}

type ProfessorInstrumentType = {
  ProfessorInstrumentID: number;
  id: string;
  name: string;
}

type ProfessorRoomType = {
  ProfessorRoomID: number;
  id: string;
}

type ProfessorType ={
  map(arg0: (item: ProfessorType) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
  length: number;
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  user: {
    email: string;
    roleID: string;
  };
  instruments?: ProfessorInstrumentType[];
}

type ProfessorAssignType = {
  id: string;
  contract: boolean;
  hours: number;
  instruments: SelectableInstrument[];
  rooms: SelectableRoom[];
  availability: ScheduleType[];
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

type GroupClassType = {
  id: string;
  name: string;
  roomId: number;
  dayId: number;
  startTime: string;
  endTime: string;
  professors: string[];
  enrollments: string[];
}


type AvailableSlotType = {
  dayDisplayName: string;
  dayName: string;
  id: number;
  slots: { start: string; end: string }[];
}

type AvailabilityByRoomType = {
  availableSlots: AvailableSlotType[];
  recurrence: number;
}
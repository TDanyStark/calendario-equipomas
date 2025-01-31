// types/Api.d.ts
export type DayOfWeekNameType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type ResourceType = 'instruments' | 'rooms' | 'courses' | 'semesters' | 'professors';

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

export interface Selectable {
  selected: boolean;
  [key: string]: unknown;
}


export interface InstrumentType {
  id: string;
  instrumentName: string;
}

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
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

type ProfessorType ={
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  hasContract: boolean;
  timeContract: number;
  user: {
    email: string;
    roleID: string;
  };
  availability: ScheduleType[];
}
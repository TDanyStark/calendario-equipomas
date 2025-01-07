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
  availability: Availability[];
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


export interface InstrumentType{
  id: string;
  instrumentName: string;
}

type RoomType = {
  id: string;
  name: string;
  capacity: number;
};


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
  user: {
    email: string;
    password: string;
    roleID: string;
  };
}
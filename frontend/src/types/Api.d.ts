// types/Api.d.ts
export type DayOfWeekNameType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type ResourceType = 'instruments' | 'rooms' | 'courses';


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
  startTime: string | null;
  endTime: string | null;
  isSelected: boolean;
  isOptionsOpen: boolean;
  activeTimeType: "start" | "end" | null;
}

interface ScheduleStateType {
  scheduleDays: ScheduleDayType[] | null;
  recurrence: string | null;
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
  id: string;                       // ID del curso
  name: string;                     // Nombre del curso
  isOnline: boolean;                // Indica si el curso es online
  duration: number;                 // Duración del curso en minutos
  availability: ScheduleDayType[]; // Arreglo de disponibilidades del curso
};

type TestType = {
  id: string;
  name: string; 
  isOnline: boolean;
  duration: number;
};
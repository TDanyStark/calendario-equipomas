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


export interface InstrumentType{
  id: string;
  instrumentName: string;
}

type RoomType = {
  id: string;
  name: string;
  capacity: number;
};

type CourseAvailability = {
  dayOfWeek: DayOfWeekNameType; // Ej: 'Monday', 'Tuesday', etc.
  startTime: date | null; // Formato de tiempo o null si no se especifica
  endTime: date | null;   // Formato de tiempo o null si no se especifica
};

type CourseType = {
  id: string;                       // ID del curso
  name: string;                     // Nombre del curso
  isOnline: boolean;                // Indica si el curso es online
  duration: number;                 // Duración del curso en minutos
  availability: CourseAvailability[]; // Arreglo de disponibilidades del curso
};
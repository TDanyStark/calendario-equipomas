// types/Api.d.ts
export type DayOfWeekNameType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type ResourceType = 'instruments' | 'rooms' | 'courses';

type DayOfWeekType = {
  id: number;
  name: DayOfWeekNameType;       // Nombre en inglés
  displayName: string; // Nombre en español
};

type ScheduleDay = {
  id: string;            // ID único para cada día
  dayName: DayOfWeekNameType;
  dayDisplayName: string;   // Nombre del día en español para mostrar
  startTime: string;        // Hora de inicio en formato 'HH:MM'
  endTime: string;          // Hora de fin en formato 'HH:MM'
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
  dayOfWeek: DayOfWeekNameType;      // Ej: 'Monday', 'Tuesday', etc.
  startTime: date | null; // Formato de tiempo o null si no se especifica
  endTime: date | null;   // Formato de tiempo o null si no se especifica
};

type CourseType = {
  id: string;                    // ID del curso
  name: string;                  // Nombre del curso
  isOnline: boolean;             // Indica si el curso es online
  availability: CourseAvailability[]; // Arreglo de disponibilidades del curso
};
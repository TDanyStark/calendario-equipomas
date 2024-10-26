// types/Api.d.ts
export type DayOfWeekNameType = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type ResourceType = 'instruments' | 'rooms' | 'courses';

type DayOfWeekType = {
  id: number;
  name: DayOfWeekNameType;       // Nombre en inglés
  displayName: string; // Nombre en español
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
  startTime: string | null; // Formato de tiempo o null si no se especifica
  endTime: string | null;   // Formato de tiempo o null si no se especifica
};

type CourseType = {
  id: number;                    // ID del curso
  name: string;                  // Nombre del curso
  isOnline: boolean;             // Indica si el curso es online
  availability: CourseAvailability[]; // Arreglo de disponibilidades del curso
};
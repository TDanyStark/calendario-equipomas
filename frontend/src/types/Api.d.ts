// types/Api.d.ts
export type DayOfWeekName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type ResourceType = 'instruments' | 'rooms' | 'courses';

type DayOfWeek = {
  id: number;
  name: DayOfWeekName;       // Nombre en inglés
  displayName: string; // Nombre en español
};

export interface InstrumentType{
  id: string;
  instrumentName: string;
}

type Room = {
  id: string;
  name: string;
  capacity: number;
};

type CourseAvailability = {
  dayOfWeek: string;      // Ej: 'Monday', 'Tuesday', etc.
  startTime: string | null; // Formato de tiempo o null si no se especifica
  endTime: string | null;   // Formato de tiempo o null si no se especifica
};

type Course = {
  id: number;                    // ID del curso
  name: string;                  // Nombre del curso
  description: string | null;    // Descripción, puede ser null si no se especifica
  isOnline: boolean;             // Indica si el curso es online
  availability: CourseAvailability[]; // Arreglo de disponibilidades del curso
};
// types/Api.d.ts
export type ResourceType = 'instruments' | 'classrooms' | 'semesters' | 'professors' | 'students';

// Extiende TableNode
export interface InstrumentType{
  id: string;
  instrumentName: string;
}

type Room = {
  id: number;
  name: string;
  capacity: number;
};

// types/Api.d.ts
export type ResourceType = 'instruments' | 'rooms' | 'semesters' | 'professors' | 'students';

// Extiende TableNode
export interface InstrumentType{
  id: string;
  instrumentName: string;
}

type Room = {
  id: string;
  name: string;
  capacity: number;
};

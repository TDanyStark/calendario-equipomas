// types/Api.d.ts
export type ResourceType = 'instruments' | 'classrooms' | 'semesters' | 'professors' | 'students';

// Extiende TableNode
export interface InstrumentType{
  id: string; // ya que `TableNode` típicamente requiere `id`
  instrumentName: string;
}

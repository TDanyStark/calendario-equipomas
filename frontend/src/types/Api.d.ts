// types/Api.d.ts
import { TableNode } from "@table-library/react-table-library/types";

export type ResourceType = 'instruments' | 'classrooms' | 'semesters' | 'professors' | 'students';

// Extiende TableNode
export interface InstrumentType extends TableNode {
  id: string; // ya que `TableNode` típicamente requiere `id`
  instrumentName: string;
}

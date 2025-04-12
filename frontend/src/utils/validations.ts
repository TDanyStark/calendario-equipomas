import { ProfessorAssignType } from "@/types/Api";

export const validateIfProfessorIsNotAssigned = (professor: ProfessorAssignType) => {
    return (
      professor.instruments.length === 0 &&
      professor.availability.length === 0 &&
      professor.rooms.length === 0
    );
  };
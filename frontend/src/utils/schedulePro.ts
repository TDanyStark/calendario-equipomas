import { Availability } from "../types/Api";

// =======================
// UTILIDADES
// =======================

const parseTimeToMinutes = (timeStr: string): number => {
  // timeStr en formato "HH:MM"
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

interface FormatMinutesToTime {
  (totalMinutes: number): string;
}

const formatMinutesToTime: FormatMinutesToTime = (totalMinutes) => {
  let h = Math.floor(totalMinutes / 60);
  let m = totalMinutes % 60;
  // Asegurar que no se pase de 23:59
  if (h >= 24) h = 23;
  if (m > 59) m = 59;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const generateTimeOptions = (interval: number, startTime: string, endTime: string) => {
  const times = [];
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  
  for (let i = startMinutes; i <= endMinutes; i += interval) {
    times.push(formatMinutesToTime(i));
  }

  return times;
};

export const formatTimeFrontend = (time: string): string => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

interface ValidateSlot {
  (
    availability: Availability[],
    avIndex: number,
    recurrence: number
  ): void;
}
const validateSlot: ValidateSlot = (availability, avIndex, recurrence) => {
  const slot = availability[avIndex];
  const startMin = parseTimeToMinutes(slot.startTime);
  let endMin = parseTimeToMinutes(slot.endTime);

  // 1) Verificar que start < end (no puede ser igual, debe ser mayor)
  if (startMin >= endMin) {
    endMin = startMin + recurrence; // forzamos 15 min más
    slot.endTime = formatMinutesToTime(endMin);
  }
};


export {
  parseTimeToMinutes, formatMinutesToTime, generateTimeOptions, validateSlot
}
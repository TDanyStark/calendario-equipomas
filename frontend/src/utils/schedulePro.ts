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


export {
  parseTimeToMinutes, formatMinutesToTime, generateTimeOptions
}
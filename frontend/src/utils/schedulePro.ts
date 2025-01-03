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

const generateTimeOptions = (interval: number) => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += interval) {
      const hour = String(h).padStart(2, "0");
      const minute = String(m).padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
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
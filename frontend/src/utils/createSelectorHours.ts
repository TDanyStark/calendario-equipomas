import { ScheduleDayType, SelectScheduleType } from "../types/Api";

const createSelectorHours = (id: string, type: "start" | "end", daysOfWeek: ScheduleDayType[] | null, selectSchedule: SelectScheduleType[] | null, recurrence: string | null) => {
  const hours = [];
  // traer el dia que tenga isOptionsOpen true
  const daySelected = daysOfWeek?.find((d) => d.id === id);
  const daySelectedSchedule = selectSchedule?.find((d) => d.id === id);


  if (daySelected && daySelectedSchedule) {
    let startDate = new Date(`1970-01-01T${daySelected.startTime}`);
    const endDate = new Date(`1970-01-01T${daySelected.endTime}`);

    // esto para no permitir que la hora de fin sea menor a la hora de inicio
    if (type === "end") {
      startDate = new Date(`1970-01-01T${daySelectedSchedule.startTime}`);
    }
    while (startDate <= endDate) {
      hours.push(startDate.toTimeString().slice(0, 5));
      startDate.setMinutes(
        startDate.getMinutes() + (recurrence ? parseInt(recurrence) : 60)
      );
    }
  }

  // esto para que en el starTime nunca este el ultimo valor, ya que ese es el valor de endTime
  if (type === "start") {
    hours.pop();
  } else {
    hours.shift();
  }
  return hours;
};

export default createSelectorHours;
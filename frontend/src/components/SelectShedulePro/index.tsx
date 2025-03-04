import { useEffect } from "react";
import PlusSvg from "../../icons/PlusSvg";
import {
  formatMinutesToTime,
  parseTimeToMinutes,
  formatTimeFrontend,
  validateSlot,
} from "../../utils/schedulePro";
import { useSelector } from "react-redux";
import {
  ScheduleStateType,
  ScheduleType,
  ScheduleDayType,
  Availability,
  AvailabilityForScheduleProType,
} from "../../types/Api";
import TimeRangeRow from "./TimeRangeRow";
import CheckBoxToggle from "../selectSchedule/CheckBoxToggle";

interface Props<T> {
  schedule: ScheduleType[];
  setSchedule: (schedule: ScheduleType[]) => void;
  canBeAdded: boolean;
  editItem: T | null;
}

const SelectShedulePro = <T,>({
  schedule,
  setSchedule,
  canBeAdded = true,
  editItem,
}: Props<T>) => {
  const scheduleWeek = useSelector(
    (state: { schedule: ScheduleStateType }) => state.schedule
  );

  // Actualiza el estado local `schedule` cuando `scheduleWeek` cambie
  useEffect(() => {
    if (scheduleWeek && scheduleWeek.scheduleDays) {
      const updatedSchedule = scheduleWeek.scheduleDays.map(
        (day: ScheduleDayType) => {
          let willActive = true;
          if (editItem && isItemType(editItem)) {
            willActive = (
              editItem as unknown as {
                availability: AvailabilityForScheduleProType[];
              }
            ).availability.some((d) => String(d.dayID) === String(day.id));
          }

          return {
            isActive: willActive,
            id: day.id,
            dayName: day.dayName,
            dayDisplayName: day.dayDisplayName,
            hours: [
              {
                startTime: formatTimeFrontend(day.startTime),
                endTime: formatTimeFrontend(day.endTime),
              },
            ],
          };
        }
      );

      if (editItem && isItemType(editItem)) {
        // borrar el horario que se coloco por el estado global y colocar los guardados en la base de datos solo de los dias que se encuentran en la informacion del profesor
        const daysFound = new Set();
        (
          editItem as unknown as {
            availability: AvailabilityForScheduleProType[];
          }
        ).availability.forEach((day: AvailabilityForScheduleProType) => {
          const dayIndex = updatedSchedule.findIndex((d) => d.id === day.dayID);
          if (dayIndex !== -1) {
            if (!daysFound.has(dayIndex)) {
              daysFound.add(dayIndex);
              updatedSchedule[dayIndex].hours = [];
            }
            updatedSchedule[dayIndex].hours.push({
              startTime: formatTimeFrontend(day.startTime),
              endTime: formatTimeFrontend(day.endTime),
            });
          }
        });
      }
      setSchedule(updatedSchedule);
    }
  }, [editItem, scheduleWeek, setSchedule]);

  if (!scheduleWeek?.scheduleDays || !scheduleWeek?.recurrence) {
    return null; // Si no hay datos, no renderiza nada
  }

  const recurrence = scheduleWeek.recurrence;

  // Cambia el estado (on/off) de un día
  const handleToggleDay = (index: number) => {
    const updated = [...schedule];
    updated[index].isActive = !updated[index].isActive;
    setSchedule(updated);
  };

  // Agrega un horario a un día
  interface HandleAddAvailability {
    (dayIndex: number, id: string): void;
  }
  const handleAddAvailability: HandleAddAvailability = (dayIndex, id) => {
    const updated = [...schedule];
    const dayAvailability = updated[dayIndex].hours;

    const selectDayWeek = scheduleWeek?.scheduleDays?.find(
      (day: ScheduleDayType) => day.id === id
    );

    const lastEnd = dayAvailability[dayAvailability.length - 1].endTime;
    const lastEndMin = parseTimeToMinutes(lastEnd);
    const newStartMin = lastEndMin + recurrence;
    const newStart = formatMinutesToTime(newStartMin);
    const newEnd = formatMinutesToTime(
      selectDayWeek?.endTime
        ? parseTimeToMinutes(selectDayWeek.endTime)
        : newStartMin + recurrence
    );

    dayAvailability.push({
      startTime: newStart,
      endTime: newEnd,
    });
    setSchedule(updated);
  };

  // Borra un horario de un día (si hay más de uno)
  interface HandleRemoveAvailability {
    (dayIndex: number, avIndex: number): void;
  }
  const handleRemoveAvailability: HandleRemoveAvailability = (
    dayIndex,
    avIndex
  ) => {
    const updated = [...schedule];
    if (updated[dayIndex].hours.length > 1) {
      updated[dayIndex].hours.splice(avIndex, 1);
      setSchedule(updated);
    }
  };

  // Actualiza la hora (startTime o endTime)
  interface HandleTimeChange {
    (
      dayIndex: number,
      avIndex: number,
      type: "startTime" | "endTime",
      newTime: string
    ): void;
  }
  const handleTimeChange: HandleTimeChange = (
    dayIndex,
    avIndex,
    type,
    newTime
  ) => {
    const updated = [...schedule];
    const dayAvailability = updated[dayIndex].hours;
    const currentSlot = dayAvailability[avIndex];

    // Seteamos temporalmente la hora elegida
    currentSlot[type] = newTime;

    // Validaciones
    validateSlot(dayAvailability, avIndex, recurrence);

    // Volvemos a dejar el array ya validado
    updated[dayIndex].hours = dayAvailability;
    setSchedule(updated);
  };

  return (
    <div className="min-h-[360px]">
      <h2 className="font-bold">Horario de Disponibilidad</h2>
      <div className="flex flex-col gap-4 mt-4">
        {schedule.map((day, dayIndex) => (
          <div key={day.dayName} className="flex gap-4 min-h-10">
            <div className="min-w-24 pt-1">
              <CheckBoxToggle
                id={day.id}
                dayDisplayName={day.dayDisplayName}
                isSelected={day.isActive}
                onChange={() => handleToggleDay(dayIndex)}
              />
            </div>
            {day.isActive && (
              <>
                <div className="space-y-2 min-w-[178px]">
                  {day.hours.map((av: Availability, avIndex: number) => (
                    <TimeRangeRow
                      key={avIndex}
                      startTime={av.startTime}
                      endTime={av.endTime}
                      dayIndex={day.id}
                      onChangeStart={(val: string) =>
                        handleTimeChange(dayIndex, avIndex, "startTime", val)
                      }
                      onChangeEnd={(val: string) =>
                        handleTimeChange(dayIndex, avIndex, "endTime", val)
                      }
                      onRemove={() =>
                        handleRemoveAvailability(dayIndex, avIndex)
                      }
                      canRemove={day.hours.length > 1}
                    />
                  ))}
                </div>
                {scheduleWeek.scheduleDays &&
                canBeAdded &&
                parseTimeToMinutes(day.hours[day.hours.length - 1].endTime) >=
                  parseTimeToMinutes(
                    formatTimeFrontend(
                      scheduleWeek.scheduleDays[dayIndex].endTime
                    )
                  ) ? null : (
                  <div>
                    <button
                      onClick={() => handleAddAvailability(dayIndex, day.id)}
                      className="text-white mt-[5px]"
                    >
                      <PlusSvg />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

function isItemType<T>(obj: T): obj is T {
  return (
    !!obj &&
    typeof obj === "object" &&
    "availability" in obj &&
    Array.isArray(obj.availability) &&
    obj.availability.length > 0
  );
}

export default SelectShedulePro;

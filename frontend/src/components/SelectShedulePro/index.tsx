import { useEffect } from "react";
import PlusSvg from "../../icons/PlusSvg";
import {
  formatMinutesToTime,
  parseTimeToMinutes,
  formatTimeFrontend,
  validateSlot
} from "../../utils/schedulePro";
import { useSelector } from "react-redux";
import { 
  ScheduleStateType, 
  ScheduleType, 
  ScheduleDayType, 
  Availability 
} from "../../types/Api";
import TimeRangeRow from "./TimeRangeRow";
import CheckBoxToggle from "../selectSchedule/CheckBoxToggle";

interface Props{
  schedule: ScheduleType[];
  setSchedule: (schedule: ScheduleType[]) => void;
  canBeAdded: boolean;
}

const SelectShedulePro = ({schedule, setSchedule, canBeAdded = true}: Props) => {
  const scheduleWeek = useSelector(
    (state: { schedule: ScheduleStateType }) => state.schedule
  );

  // Actualiza el estado local `schedule` cuando `scheduleWeek` cambie
  useEffect(() => {
    if (scheduleWeek && scheduleWeek.scheduleDays) {
      const updatedSchedule = scheduleWeek.scheduleDays.map((day: ScheduleDayType) => {
        return {
          isActive: true,
          id: day.id,
          dayName: day.dayName,
          dayDisplayName: day.dayDisplayName,
          availability: [
            {
              startTime: formatTimeFrontend(day.startTime),
              endTime: formatTimeFrontend(day.endTime),
            },
          ],
        };
      });

      setSchedule(updatedSchedule);
    }
  }, [scheduleWeek, setSchedule]);

  if (!scheduleWeek?.scheduleDays || !scheduleWeek?.recurrence) {
    return null; // Si no hay datos, no renderiza nada
  }

  const recurrence = scheduleWeek.recurrence;

  // Cambia el estado (on/off) de un día
  interface HandleToggleDay {
    (index: number): void;
  }
  const handleToggleDay: HandleToggleDay = (index) => {
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
    const dayAvailability = updated[dayIndex].availability;

    const selectDayWeek = scheduleWeek?.scheduleDays?.find((day: ScheduleDayType) => day.id === id);

    const lastEnd = dayAvailability[dayAvailability.length - 1].endTime;
    const lastEndMin = parseTimeToMinutes(lastEnd);
    const newStartMin = lastEndMin + recurrence;
    const newStart = formatMinutesToTime(newStartMin);
    const newEnd = formatMinutesToTime(selectDayWeek?.endTime ? parseTimeToMinutes(selectDayWeek.endTime) : newStartMin + recurrence); 
    
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
    if (updated[dayIndex].availability.length > 1) {
      updated[dayIndex].availability.splice(avIndex, 1);
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
    const dayAvailability = updated[dayIndex].availability;
    const currentSlot = dayAvailability[avIndex];

    // Seteamos temporalmente la hora elegida
    currentSlot[type] = newTime;

    // Validaciones
    validateSlot(dayAvailability, avIndex, recurrence);
    
    // Volvemos a dejar el array ya validado
    updated[dayIndex].availability = dayAvailability;
    setSchedule(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold">Horario de Disponibilidad</h2>
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
                {day.availability.map((av: Availability, avIndex: number) => (
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
                    onRemove={() => handleRemoveAvailability(dayIndex, avIndex)}
                    canRemove={day.availability.length > 1}
                  />
                ))}
              </div>
              {scheduleWeek.scheduleDays && canBeAdded &&
              parseTimeToMinutes(
                day.availability[day.availability.length - 1].endTime
              ) 
              >=
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
  );
};

export default SelectShedulePro;

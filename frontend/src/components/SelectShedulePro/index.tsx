import { useState, useEffect } from "react";
import PlusSvg from "../../icons/PlusSvg";
import {
  formatMinutesToTime,
  parseTimeToMinutes,
  formatTimeFrontend,
} from "../../utils/schedulePro";
import { useSelector } from "react-redux";
import { ScheduleStateType } from "../../types/Api";
import TimeRangeRow from "./TimeRangeRow";

interface Availability {
  startTime: string;
  endTime: string;
}
interface Schedule {
  isActive: boolean;
  id: string;
  dayName: string;
  dayDisplayName: string;
  availability: Availability[];
}
// =======================
// COMPONENTE PRINCIPAL
// =======================
const SelectShedulePro = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const scheduleWeek = useSelector(
    (state: { schedule: ScheduleStateType }) => state.schedule
  );

  // Actualiza el estado local `schedule` cuando `scheduleWeek` cambie
  useEffect(() => {
    if (scheduleWeek && scheduleWeek.scheduleDays) {
      const updatedSchedule = scheduleWeek.scheduleDays.map((day) => {
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
  }, [scheduleWeek]);

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

    const selectDayWeek = scheduleWeek?.scheduleDays?.find((day) => day.id === id);

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
    validateSlot(dayAvailability, avIndex, type);

    // Volvemos a dejar el array ya validado
    updated[dayIndex].availability = dayAvailability;
    setSchedule(updated);
  };

  // Función que valida un "slot" (startTime - endTime):
  // 1) Si start >= end, forzamos end a ser la siguiente opción de start.
  // 2) Si existe un slot anterior, verificamos que el start actual no sea
  //    menor o igual al end del slot anterior.
  // 3) Si existe un slot siguiente, aseguramos que su start sea > a nuestro end.
  interface ValidateSlot {
    (
      availability: Availability[],
      avIndex: number,
      changedType: "startTime" | "endTime"
    ): void;
  }

  const validateSlot: ValidateSlot = (availability, avIndex) => {
    const slot = availability[avIndex];
    const startMin = parseTimeToMinutes(slot.startTime);
    let endMin = parseTimeToMinutes(slot.endTime);

    // 1) Verificar que start < end (no puede ser igual, debe ser mayor)
    if (startMin >= endMin) {
      endMin = startMin + 15; // forzamos 15 min más
      slot.endTime = formatMinutesToTime(endMin);
    }

    // 2) Si no es el primer slot, forzar que mi start sea >= end del anterior + 15
    //    según tu regla, "nunca puede permitir que la hora de inicio sea menor
    //    que la hora de fin" (y para no chocar, sumamos 15 min).
    if (avIndex > 0) {
      const prevSlot = availability[avIndex - 1];
      const prevEndMin = parseTimeToMinutes(prevSlot.endTime);
      if (startMin <= prevEndMin) {
        // Ajustamos start a prevEndMin + 15
        const newStartMin = prevEndMin + 15;
        slot.startTime = formatMinutesToTime(newStartMin);
        // Y revalidamos la relación con endTime
        if (
          parseTimeToMinutes(slot.startTime) >= parseTimeToMinutes(slot.endTime)
        ) {
          const forcedEnd = parseTimeToMinutes(slot.startTime) + 15;
          slot.endTime = formatMinutesToTime(forcedEnd);
        }
      }
    }

    // 3) Si no es el último slot, forzar que el siguiente slot comience
    //    al menos 15 min después del end actual.
    if (avIndex < availability.length - 1) {
      const nextSlot = availability[avIndex + 1];
      const currentEndMin = parseTimeToMinutes(slot.endTime);
      let nextStartMin = parseTimeToMinutes(nextSlot.startTime);

      if (nextStartMin <= currentEndMin) {
        // Mover el siguiente start a currentEndMin + 15
        nextStartMin = currentEndMin + 15;
        nextSlot.startTime = formatMinutesToTime(nextStartMin);
        // También habrá que forzar su end si quedó menor
        if (
          parseTimeToMinutes(nextSlot.startTime) >=
          parseTimeToMinutes(nextSlot.endTime)
        ) {
          const forcedNextEnd = parseTimeToMinutes(nextSlot.startTime) + 15;
          nextSlot.endTime = formatMinutesToTime(forcedNextEnd);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2>Horario de Atención</h2>
      {schedule.map((day, dayIndex) => (
        <div key={day.dayName} className="flex gap-4 min-h-10">
          <div className="min-w-24">
            <label className="flex items-center pt-[5px]">
              <input
                type="checkbox"
                checked={day.isActive}
                onChange={() => handleToggleDay(dayIndex)}
                className="w-5 h-5"
              />
              <span className="ml-2">{day.dayDisplayName}</span>
            </label>
          </div>
          {day.isActive && (
            <>
              <div className="space-y-2 min-w-[178px]">
                {day.availability.map((av, avIndex) => (
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
              {scheduleWeek.scheduleDays &&
              parseTimeToMinutes(
                day.availability[day.availability.length - 1].endTime
              ) >=
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

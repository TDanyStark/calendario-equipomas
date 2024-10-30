import { useSelector } from "react-redux";
import {
  ScheduleDayType,
  DayOfWeekNameType,
  ScheduleState,
} from "../../types/Api";
import { useEffect, useState } from "react";
import CheckBoxToggle from "./CheckBoxToggle";
import { toast } from "react-toastify";

interface SelectSchedule {
  id: string;
  dayName: DayOfWeekNameType;
  dayDisplayName: string;
  startTime: string | null;
  endTime: string | null;
  isSelected: boolean;
  isOptionsOpen: boolean;
  activeTimeType: "start" | "end" | null;
}

type WithAvailability = {
  availability: Array<ScheduleDayType>;
};

interface Props<T> {
  editItem: T | null;
  onScheduleChange: (schedule: SelectSchedule[]) => void;
}

const SelectSchedule = <T extends WithAvailability>({
  editItem = null,
  onScheduleChange,
}: Props<T>) => {
  const daysOfWeek = useSelector(
    (state: { schedule: ScheduleState }) => state.schedule.scheduleDays
  );
  const recurrence = useSelector(
    (state: { schedule: ScheduleState }) => state.schedule.recurrence
  );

  const [selectSchedule, setSelectSchedule] = useState<SelectSchedule[]>([]);

  useEffect(() => {
    if (daysOfWeek) {
      let initialSchedule = daysOfWeek.map((day) => ({
        id: day.id,
        dayName: day.dayName,
        dayDisplayName: day.dayDisplayName,
        startTime: day.startTime.slice(0, 5),
        endTime: day.endTime.slice(0, 5),
        isSelected: true, // Campo adicional inicializado como false
        isOptionsOpen: false,
        activeTimeType: null,
      }));

      if (editItem) {
        const availabilityIds = editItem.availability.map(
          (availability) => availability.id
        );
        initialSchedule = initialSchedule.map((day) => {
          if (availabilityIds.includes(day.id)) {
            const availability = editItem.availability.find(
              (a) => a.id === day.id
            );
            return {
              ...day,
              startTime: availability?.startTime.slice(0, 5) || "error",
              endTime: availability?.endTime.slice(0, 5) || "error",
            };
          }
          return day;
        });
      }

      setSelectSchedule(initialSchedule);
    }
  }, [daysOfWeek, editItem]);

  useEffect(() => {
    onScheduleChange(selectSchedule);
  }, [selectSchedule, onScheduleChange]);


  const handleChange = (id: string) => {
    setSelectSchedule((prev) =>
      prev.map((day) =>
        day.id === id
          ? {
              ...day,
              isSelected: !day.isSelected,
              isOptionsOpen: false,
              activeTimeType: null,
            }
          : day
      )
    );
  };

  const handleOpenOptions = (id: string, type: "start" | "end") => {
    setSelectSchedule((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, isOptionsOpen: !d.isOptionsOpen, activeTimeType: type }
          : { ...d, isOptionsOpen: false, activeTimeType: null }
      )
    );
  };

  const createSelectorHours = (id: string, type: "start" | "end") => {
    const hours = [];
    // traer el dia que tenga isOptionsOpen true
    const daySelected = daysOfWeek?.find((d) => d.id === id);
    const daySelectedSchedule = selectSchedule?.find((d) => d.id === id);


    if (daySelected && daySelectedSchedule) {
      let startDate = new Date(`1970-01-01T${daySelected.startTime}`);
      const endDate = new Date(`1970-01-01T${daySelected.endTime}`);

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

    if (type === "start") {
      hours.pop();
    } else {
      hours.shift();
    }
    return hours;
  };

  const handleSelectHour = (id: string, type: "start" | "end", hour: string) => {
    const daySelected = selectSchedule.find((d) => d.id === id);
    
    // Verificar si la hora de fin es menor o igual a la hora de inicio
    if (hour && daySelected?.startTime && type === "end") {
      const horaFin = new Date(`1970-01-01T${hour}`);
      const horaInicio = new Date(`1970-01-01T${daySelected?.startTime}`);
      
      if (horaFin <= horaInicio) {
        toast.error("La hora de fin no puede ser menor a la hora de inicio");
        toast.clearWaitingQueue();
        return; 
      }
    }
  
    // Actualizar el estado selectSchedule
    setSelectSchedule((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              [type === "start" ? "startTime" : "endTime"]: hour,
            }
          : d
      )
    );
  };

  return (
    <ul className="flex flex-col gap-4 mt-4">
      {selectSchedule?.map((day) => (
        <li key={day.id} className="flex gap-4 min-h-10">
          <CheckBoxToggle
            id={day.id}
            dayDisplayName={day.dayDisplayName}
            isSelected={day.isSelected}
            onChange={handleChange}
          />
          {day.isSelected && (
            <div className="dayActive flex gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="hourStart w-24 h-10 border border-gray-600 rounded-md flex items-center justify-center cursor-text relative"
                  onClick={() => handleOpenOptions(day.id, "start")}
                >
                  <span>{day.startTime}</span>
                  {day.isOptionsOpen && day.activeTimeType === "start" && (
                    <div className="absolute top-10 left-0 right-0 w-full bg-gray-800 z-50 max-h-52 overflow-y-auto flex flex-col scroll-thin">
                      {createSelectorHours(day.id, "start").map((hour) => (
                        <button
                          key={hour}
                          className="py-1 w-full hover:bg-gray-700"
                          onClick={() =>
                            handleSelectHour(day.id, "start", hour)
                          }
                        >
                          {hour}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span>-</span>
                <div
                  className="hourEnd w-24 h-10 border border-gray-600 rounded-md flex items-center justify-center cursor-text relative"
                  onClick={() => handleOpenOptions(day.id, "end")}
                >
                  <span>{day.endTime}</span>
                  {day.isOptionsOpen && day.activeTimeType === "end" && (
                    <div className="absolute top-10 left-0 right-0 w-full bg-gray-800 z-50 max-h-52 overflow-y-auto flex flex-col scroll-thin">
                      {createSelectorHours(day.id, "end").map((hour) => (
                        <button
                          key={hour}
                          className="py-1 w-full hover:bg-gray-700"
                          onClick={() => handleSelectHour(day.id, "end", hour)}
                        >
                          {hour}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="controls flex">
                {/* <PlusBtn handleClick={() => {}} /> */}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SelectSchedule;

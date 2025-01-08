import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { generateTimeOptions } from "../../utils/schedulePro";
import { ScheduleStateType } from "../../types/Api";

interface TimePickerProps {
  value: string;
  onChange: (val: string) => void;
  dayIndex: string;
}
const TimePicker = ({ value, onChange, dayIndex }: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  interface HandleOptionClick {
    (option: string): void;
  }
  const handleOptionClick: HandleOptionClick = (option) => {
    onChange(option);
    setOpen(false);
  };

  const scheduleWeek = useSelector(
    (state: { schedule: ScheduleStateType }) => state.schedule
  );

  const selectedDay = scheduleWeek.scheduleDays?.find(
    (day) => day.id === dayIndex
  );

  const startTime = selectedDay?.startTime ?? "";
  const endTime = selectedDay?.endTime ?? "";
  const interval = scheduleWeek.recurrence ?? 0;

  //TODO: validar que el tiempo se muestre solo en los valores permitidos, como por ejemplo que no se genere valores finales antes que el valor de inicio, que el valor de inicio no sea mayor al valor mayor de la hora anterior, etc.
  const timeOptions = generateTimeOptions(interval, startTime, endTime);

  return (
    <div className="relative" ref={ref}>
      <div
        className="text-center  w-24 h-10 cursor-pointer border border-gray-300 rounded flex items-center justify-center"
        onClick={() => setOpen(!open)}
      >
        {value}
      </div>
      {open && (
        <div
          className="absolute top-full left-0 bg-white border border-gray-300 max-h-[200px] overflow-y-auto z-50 w-[96px]"
        >
          {timeOptions.map((option) => (
            <div
              key={option}
              className="p-1 cursor-pointer bg-black hover:bg-gray-900 flex justify-center"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimePicker;
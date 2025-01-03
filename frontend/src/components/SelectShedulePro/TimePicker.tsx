import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { generateTimeOptions } from "../../utils/schedulePro";
import { ScheduleStateType } from "../../types/Api";

interface TimePickerProps {
  value: string;
  onChange: (val: string) => void;
}
const TimePicker = ({ value, onChange }: TimePickerProps) => {
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

  const timeOptions = generateTimeOptions(scheduleWeek.recurrence ?? 0);

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <div
        style={{
          border: "1px solid #aaa",
          padding: "4px 8px",
          cursor: "pointer",
          minWidth: 60,
          textAlign: "center",
        }}
        onClick={() => setOpen(!open)}
      >
        {value}
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 999,
            width: 80,
          }}
        >
          {timeOptions.map((option) => (
            <div
              key={option}
              className="p-1 cursor-pointer bg-black hover:bg-gray-900"
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
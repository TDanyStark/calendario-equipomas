import useGetAvailabilityByRoom from "@/hooks/useGetAvailabilityByRoom";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Skeleton from "../Loader/Skeleton";
import { AvailableSlotType } from "@/types/Api";
import { useEffect, useState } from "react";
import { addSecondsToTime, formatToHHMM, generarIntervalos, to12HourFormat } from "@/utils/timeConversionUtils";

interface Props {
  roomId: number | null;
  onChange: (data: { day: number | null; startTime: string | null; endTime: string | null }) => void;
  defaultDay?: number | null;
  defaultStartTime?: string | null;
  defaultEndTime?: string | null;
  idGroupClassEdit?: number | null;
}

const SelectDayAndHourCreate = ({ roomId, onChange, defaultDay = null, defaultStartTime = null, defaultEndTime = null, idGroupClassEdit }: Props) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(defaultDay);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(defaultStartTime ? to12HourFormat(defaultStartTime) : null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(defaultEndTime ? to12HourFormat(defaultEndTime) : null);
  const [endTimeOptions, setEndTimeOptions] = useState<string[]>([]);

  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const { data, isLoading, isError } = useGetAvailabilityByRoom(
    "groupclass",
    "/availability-by-room",
    roomId,
    JWT,
    idGroupClassEdit ? idGroupClassEdit : null
  );

  const availability = data?.availableSlots as AvailableSlotType[];
  const recurrence = data?.recurrence || 30;

  // Efecto para establecer los valores iniciales cuando se cargan los datos
  useEffect(() => {
    if (availability && defaultDay && defaultStartTime && defaultEndTime) {
      setSelectedDay(defaultDay);
      const daySlots = availability.find(day => day.id === defaultDay)?.slots;
      
      if (daySlots) {
        const start12h = to12HourFormat(defaultStartTime);
        const end12h = to12HourFormat(defaultEndTime);
        
        // Encontrar el slot que contiene la hora de inicio
        for (const slot of daySlots) {
          const times = generarIntervalos(slot.start, slot.end, recurrence);
          if (times.includes(start12h) && times.includes(end12h)) {
            console.log("times", times);
            const startIndex = times.indexOf(start12h);
            const endTimes = times.slice(startIndex + 1);
            setEndTimeOptions(endTimes);
            setSelectedStartTime(start12h);
            setSelectedEndTime(end12h);
            break;
          }
        }
      }
    }
  }, [availability, defaultDay, defaultStartTime, defaultEndTime, recurrence]);

  // Procesar las opciones de hora inicial
  const startTimeOptions = selectedDay
    ? availability?.find((day) => day.id === selectedDay)?.slots.flatMap((slot) => {
          const times = generarIntervalos(slot.start, slot.end, recurrence);
          return times.slice(0, -1).map((time) => ({
            time,
            slotEnd: slot.end,
          }));
        }) || []
    : [];

  // Manejar cambio de hora inicial
  const handleStartTimeChange = (selectedTime: string, slotEnd: string) => {
    const endTimes = generarIntervalos(selectedTime, slotEnd, recurrence).slice(1);
    setSelectedStartTime(selectedTime);
    setEndTimeOptions(endTimes);
    setSelectedEndTime(null);
  };
  
  // le pasamos al padre la hora en formado HH:MM:SS ya que actualmente en el frontend se esta manejando en 12 horas
  useEffect(() => {
    
    onChange({
      day: selectedDay,
      startTime: selectedStartTime && addSecondsToTime(formatToHHMM(selectedStartTime)),
      endTime: selectedEndTime && addSecondsToTime(formatToHHMM(selectedEndTime)),
    });
  }, [selectedDay, selectedStartTime, selectedEndTime, onChange]);

  if (isError)
    return <div>Hubo un error al intentar cargar la disponibilidad</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="day">
          Día
        </label>
        {isLoading ? (
          <Skeleton className="w-full h-[38.4px]" />
        ) : (
          <select
            value={selectedDay || ""}
            onChange={(e) => {
              setSelectedDay(Number(e.target.value));
              setSelectedStartTime(null);
              setSelectedEndTime(null);
            }}
            className="px-3 py-2 border rounded w-full"
          >
            <option value="">Escoge un día</option>
            {availability?.map(
              (day: AvailableSlotType) =>
                day.slots.length > 0 && (
                  <option key={day.id} value={day.id}>
                    {day.dayDisplayName}
                  </option>
                )
            )}
          </select>
        )}
      </div>
      {selectedDay && (
        <div className="flex gap-4 items-center">
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium mb-1"
            >
              Hora de inicio
            </label>
            <select
              id="startTime"
              value={selectedStartTime || ""}
              onChange={(e) => {
                const selectedOption = startTimeOptions.find(
                  (opt) => opt.time === e.target.value
                );
                if (selectedOption) {
                  handleStartTimeChange(
                    selectedOption.time,
                    selectedOption.slotEnd
                  );
                }
              }}
              className="px-3 py-2 border rounded w-full"
            >
              <option value="">Seleccionar inicio</option>
              {startTimeOptions.map((option, index) => (
                <option key={index} value={option.time}>
                  {option.time}
                </option>
              ))}
            </select>
          </div>

          <span className="mt-5"> - </span>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium mb-1">
              Hora de fin
            </label>
            <select
              id="endTime"
              value={selectedEndTime || ""}
              onChange={(e) => setSelectedEndTime(e.target.value)}
              disabled={!selectedStartTime}
              className="px-3 py-2 border rounded w-full"
            >
              <option value="">Seleccionar fin</option>
              {endTimeOptions.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectDayAndHourCreate;

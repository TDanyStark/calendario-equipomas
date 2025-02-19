import useGetAvailabilityByRoom from "@/hooks/useGetAvailabilityByRoom";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Skeleton from "../Loader/Skeleton";
import { AvailableSlotType } from "@/types/Api";
import { useState } from "react";
import { formatToHHMM, generarIntervalos, to12HourFormat } from "@/utils/timeConversionUtils";

interface Props {
  roomId: string;
}

const SelectDayAndHourCreate = ({ roomId }: Props) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [endTimeOptions, setEndTimeOptions] = useState<string[]>([]);

  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const { data, isLoading, isError } = useGetAvailabilityByRoom(
    "groupclass",
    "/availability-by-room",
    roomId,
    JWT
  );

  const availability = data?.availableSlots as AvailableSlotType[];
  const recurrence = data?.recurrence || 30;

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

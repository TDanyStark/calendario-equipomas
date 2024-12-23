import React, { useState, useRef, useEffect } from "react";

// =======================
// UTILIDADES
// =======================
const parseTimeToMinutes = (timeStr) => {
  // timeStr en formato "HH:MM"
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const formatMinutesToTime = (totalMinutes) => {
  let h = Math.floor(totalMinutes / 60);
  let m = totalMinutes % 60;
  // Asegurar que no se pase de 23:59
  if (h >= 24) h = 23;
  if (m > 59) m = 59;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const generateTimeOptions = (interval = 15) => {
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

const timeOptions = generateTimeOptions(15);

// =======================
// DATOS INICIALES
// =======================
const initialSchedule = [
  {
    isActive: true,
    name: "Monday",
    DisplayName: "Lunes",
    availability: [
      { startHour: "09:00", endHour: "17:00" },
      { startHour: "18:00", endHour: "20:00" },
    ],
  },
  {
    isActive: true,
    name: "Tuesday",
    DisplayName: "Martes",
    availability: [
      { startHour: "09:00", endHour: "17:00" },
      { startHour: "18:00", endHour: "20:00" },
    ],
  },
  {
    isActive: true,
    name: "Wednesday",
    DisplayName: "Miércoles",
    availability: [
      { startHour: "09:00", endHour: "17:00" },
      { startHour: "18:00", endHour: "20:00" },
    ],
  },
  {
    isActive: false,
    name: "Thursday",
    DisplayName: "Jueves",
    availability: [],
  },
  {
    isActive: true,
    name: "Friday",
    DisplayName: "Viernes",
    availability: [{ startHour: "09:00", endHour: "17:00" }],
  },
  {
    isActive: true,
    name: "Saturday",
    DisplayName: "Sábado",
    availability: [{ startHour: "10:00", endHour: "14:00" }],
  },
  {
    isActive: false,
    name: "Sunday",
    DisplayName: "Domingo",
    availability: [],
  },
];

// =======================
// COMPONENTE PRINCIPAL
// =======================
const SelectShedulePro = () => {
  const [schedule, setSchedule] = useState(initialSchedule);

  // Cambia el estado (on/off) de un día
  const handleToggleDay = (index) => {
    const updated = [...schedule];
    updated[index].isActive = !updated[index].isActive;
    setSchedule(updated);
  };

  // Agrega un horario a un día
  const handleAddAvailability = (dayIndex) => {
    const updated = [...schedule];
    const dayAvailability = updated[dayIndex].availability;

    if (dayAvailability.length === 0) {
      // Si no hay horarios, iniciamos con 09:00 - 09:15, por ejemplo
      dayAvailability.push({ startHour: "09:00", endHour: "09:15" });
    } else {
      // Tomar la hora de fin del último horario y sumarle 15 minutos
      const lastEnd = dayAvailability[dayAvailability.length - 1].endHour;
      const lastEndMin = parseTimeToMinutes(lastEnd);
      const newStartMin = lastEndMin + 15; // +15 min
      // Generar start y end por defecto (ejemplo: un bloque de 1 hora)
      const newStart = formatMinutesToTime(newStartMin);
      const newEnd = formatMinutesToTime(newStartMin + 60); // 1 hora después

      dayAvailability.push({
        startHour: newStart,
        endHour: newEnd,
      });
    }
    setSchedule(updated);
  };

  // Borra un horario de un día (si hay más de uno)
  const handleRemoveAvailability = (dayIndex, avIndex) => {
    const updated = [...schedule];
    if (updated[dayIndex].availability.length > 1) {
      updated[dayIndex].availability.splice(avIndex, 1);
      setSchedule(updated);
    }
  };

  // Actualiza la hora (startHour o endHour)
  const handleTimeChange = (dayIndex, avIndex, type, newTime) => {
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

  // Función que valida un "slot" (startHour - endHour):
  // 1) Si start >= end, forzamos end a ser la siguiente opción de start.
  // 2) Si existe un slot anterior, verificamos que el start actual no sea
  //    menor o igual al end del slot anterior.
  // 3) Si existe un slot siguiente, aseguramos que su start sea > a nuestro end.
  const validateSlot = (availability, avIndex, changedType) => {
    const slot = availability[avIndex];
    const startMin = parseTimeToMinutes(slot.startHour);
    let endMin = parseTimeToMinutes(slot.endHour);

    // 1) Verificar que start < end (no puede ser igual, debe ser mayor)
    if (startMin >= endMin) {
      endMin = startMin + 15; // forzamos 15 min más
      slot.endHour = formatMinutesToTime(endMin);
    }

    // 2) Si no es el primer slot, forzar que mi start sea >= end del anterior + 15
    //    según tu regla, "nunca puede permitir que la hora de inicio sea menor
    //    que la hora de fin" (y para no chocar, sumamos 15 min).
    if (avIndex > 0) {
      const prevSlot = availability[avIndex - 1];
      const prevEndMin = parseTimeToMinutes(prevSlot.endHour);
      if (startMin <= prevEndMin) {
        // Ajustamos start a prevEndMin + 15
        const newStartMin = prevEndMin + 15;
        slot.startHour = formatMinutesToTime(newStartMin);
        // Y revalidamos la relación con endHour
        if (
          parseTimeToMinutes(slot.startHour) >= parseTimeToMinutes(slot.endHour)
        ) {
          const forcedEnd = parseTimeToMinutes(slot.startHour) + 15;
          slot.endHour = formatMinutesToTime(forcedEnd);
        }
      }
    }

    // 3) Si no es el último slot, forzar que el siguiente slot comience
    //    al menos 15 min después del end actual.
    if (avIndex < availability.length - 1) {
      const nextSlot = availability[avIndex + 1];
      const currentEndMin = parseTimeToMinutes(slot.endHour);
      let nextStartMin = parseTimeToMinutes(nextSlot.startHour);

      if (nextStartMin <= currentEndMin) {
        // Mover el siguiente start a currentEndMin + 15
        nextStartMin = currentEndMin + 15;
        nextSlot.startHour = formatMinutesToTime(nextStartMin);
        // También habrá que forzar su end si quedó menor
        if (
          parseTimeToMinutes(nextSlot.startHour) >=
          parseTimeToMinutes(nextSlot.endHour)
        ) {
          const forcedNextEnd = parseTimeToMinutes(nextSlot.startHour) + 15;
          nextSlot.endHour = formatMinutesToTime(forcedNextEnd);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2>Horario de Atención</h2>
      {schedule.map((day, dayIndex) => (
        <div key={day.name} className="flex gap-4 min-h-16">
          <div className="min-w-24">
            <label>
              <input
                type="checkbox"
                checked={day.isActive}
                onChange={() => handleToggleDay(dayIndex)}
                className="w-5 h-5"
              />
              <span className="ml-2">{day.DisplayName}</span>
            </label>
          </div>
          {day.isActive && (
            <>
              <div>
                {day.availability.map((av, avIndex) => (
                  <TimeRangeRow
                    key={avIndex}
                    startHour={av.startHour}
                    endHour={av.endHour}
                    onChangeStart={(val: string) =>
                      handleTimeChange(dayIndex, avIndex, "startHour", val)
                    }
                    onChangeEnd={(val: string) =>
                      handleTimeChange(dayIndex, avIndex, "endHour", val)
                    }
                    onRemove={() => handleRemoveAvailability(dayIndex, avIndex)}
                    canRemove={day.availability.length > 1}
                  />
                ))}
              </div>
              <div>
                <button
                  onClick={() => handleAddAvailability(dayIndex)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  +
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      <pre style={{ background: "#333", color: "#fff", padding: 16 }}>
        {/* Solo para debug/visualizar la estructura final */}
        {JSON.stringify(schedule, null, 2)}
      </pre>
    </div>
  );
};

// =======================
// SUBCOMPONENTES
// =======================

// Representa un rango de tiempo (Start - End)
const TimeRangeRow = ({
  startHour,
  endHour,
  onChangeStart,
  onChangeEnd,
  onRemove,
  canRemove,
}) => {
  return (
    <div 
      className="flex items-center gap-1"
    >
      <TimePicker value={startHour} onChange={onChangeStart} />
      <span style={{ margin: "0 8px" }}>-</span>
      <TimePicker value={endHour} onChange={onChangeEnd} />
      {canRemove && (
        <button
          onClick={onRemove}
          style={{ marginLeft: 8, backgroundColor: "red", color: "white" }}
        >
          Borrar
        </button>
      )}
    </div>
  );
};

// Selector de hora personalizado
const TimePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    onChange(option);
    setOpen(false);
  };

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
              style={{
                padding: "4px 8px",
                cursor: "pointer",
                backgroundColor: option === value ? "#eee" : "#fff",
              }}
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

export default SelectShedulePro;

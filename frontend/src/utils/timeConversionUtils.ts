function formatToHHMM(time: string): string {
  const regex24hr = /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  const regex12hr = /^([01]?[0-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/i;

  if (regex24hr.test(time)) {
    return time.substring(0, 5); // Convert "HH:MM:SS" to "HH:MM"
  } else if (regex12hr.test(time)) {
    const match = time.match(regex12hr);
    if (!match) throw new Error("Formato de hora no válido");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, hourStr, minuteStr, period] = match;
    let hour = parseInt(hourStr, 10);
    if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
    if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
    return `${String(hour).padStart(2, "0")}:${minuteStr}`;
  }
  throw new Error("Formato de hora no válido");
}

function to12HourFormat(time: string): string {
  const regex24hr = /^([01]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
  const match = time.match(regex24hr);
  if (!match) throw new Error("Formato de hora no válido");

  const hourStr = match[1];
  const minuteStr = match[2];
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert to 12-hour format
  return `${hour}:${minuteStr} ${period}`;
}

function addSecondsToTime(time: string): string {
  const regexHHMM = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (regexHHMM.test(time)) {
    return `${time}:00`;
  }
  throw new Error("Formato de hora no válido");
}

function generarIntervalos(
  horaInicio: string,
  horaFin: string,
  recurrencia: number
): string[] {
  // Normalizar horas (quitar segundos si existen)
  const normalizarHora = (hora: string) =>
    hora.split(":").slice(0, 2).join(":");

  // Convertir hora HH:MM a minutos totales
  const aMinutos = (hora: string) => {
    const match = hora.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
    if (!match) {
      throw new Error("Formato de hora no válido");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, h, m, amPm] = match;
    let horas = parseInt(h, 10);
    const minutos = parseInt(m, 10);

    if (amPm) {
      // Si tiene AM/PM, convertir a 24 horas
      if (amPm.toUpperCase() === "PM" && horas !== 12) {
        horas += 12;
      } else if (amPm.toUpperCase() === "AM" && horas === 12) {
        horas = 0;
      }
    }

    if (
      isNaN(horas) ||
      isNaN(minutos) ||
      horas < 0 ||
      horas > 23 ||
      minutos < 0 ||
      minutos > 59
    ) {
      throw new Error("Formato de hora no válido");
    }

    return horas * 60 + minutos;
  };

  // Convertir minutos totales a formato 12 horas
  const aHora12 = (minutos: number) => {
    const h24 = Math.floor(minutos / 60);
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    const m = (minutos % 60).toString().padStart(2, "0");
    const amPm = h24 < 12 ? "AM" : "PM";
    return `${h12}:${m} ${amPm}`;
  };

  try {
    const inicio = normalizarHora(horaInicio);
    const fin = normalizarHora(horaFin);

    const inicioMinutos = aMinutos(inicio);
    const finMinutos = aMinutos(fin);

    if (inicioMinutos > finMinutos) {
      throw new Error("La hora de inicio debe ser anterior a la hora de fin");
    }

    if (recurrencia <= 0 || recurrencia > 60) {
      throw new Error("La recurrencia debe ser un número entre 1 y 60");
    }

    const intervalos: string[] = [];
    let minutosActuales = inicioMinutos;

    while (minutosActuales <= finMinutos) {
      intervalos.push(aHora12(minutosActuales));
      minutosActuales += recurrencia;
    }

    return intervalos;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error generando intervalos: ${error.message}`);
    } else {
      throw new Error("Error generando intervalos: Error desconocido");
    }
  }
}

export { formatToHHMM, to12HourFormat, addSecondsToTime, generarIntervalos };

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { URL_BACKEND } from "../variables";

const useFetchDaysOfWeek = <ScheduleState,>() => {
  const [daysOfWeek, setDaysOfWeek] = useState<ScheduleState | null>(null);
  const [shouldRetry, setShouldRetry] = useState(false);

  const fetchDays = useCallback(async () => {
    try {
      const response = await axios.get(`${URL_BACKEND}schedule/days`);
      if (response.data.data) {
        setDaysOfWeek(response.data.data);
        setShouldRetry(false); // Detener reintentos si se obtienen datos válidos
      } else {
        setShouldRetry(true);
      }
    } catch (error) {
      console.error("Error fetching days of the week:", error);
      setShouldRetry(true); // Intentar nuevamente en caso de error
    }
  }, []);

  // Llamada inicial
  useEffect(() => {
    fetchDays();
  }, [fetchDays]);

  // Reintentos con intervalo (independiente de la llamada inicial)
  useEffect(() => {
    if (shouldRetry) {
      const retryInterval = setInterval(() => {
        fetchDays();
      }, 5000); // Reintentar cada 5 segundos
      return () => clearInterval(retryInterval);
    }
  }, [shouldRetry, fetchDays]);

  return { daysOfWeek };
};

export default useFetchDaysOfWeek;

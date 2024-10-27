// src/hooks/useFetchDaysOfWeek.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { URL_BACKEND } from "../variables";
import { ScheduleDayType } from "../types/Api";

const useFetchDaysOfWeek = () => {
  const [daysOfWeek, setDaysOfWeek] = useState<ScheduleDayType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Obtener el JWT desde el store

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await axios.get(`${URL_BACKEND}schedule/days`);
        setDaysOfWeek(response.data.data.scheduleDays);
        setIsError(false);
      } catch (error) {
        console.error("Error fetching days of the week:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDays();
  }, []);

  return { daysOfWeek, isLoading, isError };
};

export default useFetchDaysOfWeek;
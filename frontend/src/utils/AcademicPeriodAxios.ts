import { URL_BACKEND } from "@/variables";
import axios from "axios";

export const optionsSelectAC = async (id: number, JWT: string) => {
  // hacer peticion fetch a la api con axios
  const response = await axios.put(`${URL_BACKEND}academic-periods/change-select`, {
    id
  }, {
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  });
  return response.data;
}

export const createAcademicPeriod = async (data: {year:number, semester:number}, JWT: string) => {
  const response = await axios.post(`${URL_BACKEND}academic-periods`, data, {
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  });
  return response.data;
}

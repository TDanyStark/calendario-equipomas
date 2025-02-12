import { URL_BACKEND } from "@/variables";
import axios from "axios";

const selectAC = async (id: number, JWT: string) => {
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

export default selectAC;
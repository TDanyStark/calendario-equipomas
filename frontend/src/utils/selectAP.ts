import { URL_BACKEND } from "@/variables";
import axios from "axios";

const selectAC = async (settingID: string, settingValue: string, JWT: string) => {
  // hacer peticion fetch a la api con axios
  const response = await axios.put(`${URL_BACKEND}settings`, {
    settingID,
    settingValue,
  }, {
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  });
  return response.data;
}

export default selectAC;
// haz una llamada al enpoint /enrolls/idsactive usando axios.get
import { URL_BACKEND } from "@/variables";
import axios from "axios";

export const getActiveIdsEnrollments = async (JWT: string) => {
  try {
    const response = await axios.get(`${URL_BACKEND}enrolls/idsactive`, {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
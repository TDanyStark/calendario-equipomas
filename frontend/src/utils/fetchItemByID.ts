import axios from "axios";
import { URL_BACKEND } from "../variables";

const fetchItemByID = async <T>(
  resource: string,
  id: string,
  JWT: string | null
): Promise<{ data: T | null; loading: boolean; error: string | null }> => {
  try {
    const response = await axios.get(`${URL_BACKEND}${resource}/${id}`, {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });

    return {
      data: response.data.data as T, // Asegura que los datos sean del tipo T
      loading: false,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export default fetchItemByID;
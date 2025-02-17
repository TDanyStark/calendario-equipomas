// haz una llamada al enpoint /enrolls/idsactive usando axios.get
import { ResourceType } from "@/types/Api";
import { URL_BACKEND } from "@/variables";
import axios from "axios";

export const getActiveIdsForAEntity = async (JWT: string, entity: ResourceType) => {
  try {
    const response = await axios.get(`${URL_BACKEND}${entity}/idsactive`, {
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
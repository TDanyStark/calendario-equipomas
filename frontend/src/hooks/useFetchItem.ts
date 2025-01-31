import { ResourceType } from "../types/Api";
import { useQuery } from "react-query";
import { URL_BACKEND } from "../variables";
import axios from "axios";


const fetchItem = async (resource: ResourceType, id: string, JWT: string | null) => {
  const response = await axios.get(`${URL_BACKEND}${resource}/${id}`, {
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  });
  return Array.isArray(response.data.data) ? response.data.data : [];
};

const useFetchItem = (resource: ResourceType, id:string, JWT: string | null) => {
  return useQuery([resource], () => fetchItem(resource, id, JWT), {
    enabled: !!JWT,
    // refetchOnWindowFocus: false, // Desactiva la refetch al reenfocar la ventana
  });
};

export default useFetchItem;
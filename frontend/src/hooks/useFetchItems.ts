import { ResourceType } from "../types/Api";
import { useQuery } from "react-query";
import { URL_BACKEND } from "../variables";
import axios from "axios";


const fetchItems = async (resource: ResourceType, JWT: string | null) => {
  const response = await axios.get(`${URL_BACKEND}${resource}`, {
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  });
  const { data } = response.data;
  if (Array.isArray(data) || data?.data) {
    return data;
  }
  return [];
};

const FetchItems = (resource: ResourceType, JWT: string | null) => {
  return useQuery([resource], () => fetchItems(resource, JWT), {
    enabled: !!JWT,
    staleTime: 1000 * 60 * 5, // 5 minutos
    // refetchOnWindowFocus: false, // Desactiva la refetch al reenfocar la ventana
  });
};

export default FetchItems;
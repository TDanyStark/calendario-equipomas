import { ResourceType } from "../types/Api";
import { useQuery } from "react-query";
import { URL_BACKEND } from "../variables";
import axios from "axios";


const fetchItems = async (resource: ResourceType, JWT: string | null, offPagination:boolean | undefined) => {
  let URL = `${URL_BACKEND}${resource}`;
  if (offPagination) {
    URL += "?offPagination=true"; 
  }
  
  const response = await axios.get(URL, {
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

const useFetchForSelect = (resource: ResourceType, JWT: string | null, isActive: boolean, filter: string | undefined, offPagination?: boolean | undefined) => {
  return useQuery([resource], () => fetchItems(resource, JWT, offPagination), {
    enabled: !!JWT && filter ? true : isActive,
    staleTime: 1000 * 60 * 5, // 5 minutos
    // refetchOnWindowFocus: false, // Desactiva la refetch al reenfocar la ventana
  });
};

export default useFetchForSelect;
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
  return Array.isArray(response.data.data) ? response.data.data : [];
};

const useFetchItems = (resource: ResourceType, JWT: string | null) => {
  return useQuery([resource], () => fetchItems(resource, JWT), {
    enabled: !!JWT,
  });
};

export default useFetchItems;
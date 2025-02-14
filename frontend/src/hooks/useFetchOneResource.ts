import { useQuery } from "react-query";
import { URL_BACKEND } from "../variables";
import axios from "axios";


const fetchItem = async (endpoint: string, JWT: string | null) => {
  const response = await axios.get(`${URL_BACKEND}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  });
  return response.data.data
};

const useFetchOneResource = (endpoint: string,JWT: string | null, condition?: boolean) => {
  return useQuery([endpoint], () => fetchItem(endpoint, JWT), {
    enabled: !!JWT && condition,
  });
};

export default useFetchOneResource;
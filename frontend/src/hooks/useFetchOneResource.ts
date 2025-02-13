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

const useFetchOneResource = (endpoint: string,JWT: string | null) => {
  return useQuery([endpoint], () => fetchItem(endpoint, JWT), {
    enabled: !!JWT,
    // refetchOnWindowFocus: false, // Desactiva la refetch al reenfocar la ventana
  });
};

export default useFetchOneResource;
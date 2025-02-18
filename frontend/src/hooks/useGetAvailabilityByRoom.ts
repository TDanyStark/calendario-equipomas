import { useQuery } from "react-query";
import { URL_BACKEND } from "../variables";
import axios from "axios";


const fetchItem = async (entity: string, endpoint: string, roomId: string | null,  JWT: string | null) => {
  const response = await axios.get(`${URL_BACKEND}${entity}${endpoint}?roomId=${roomId}`, {
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  });
  return response.data.data
};

const useGetAvailabilityByRoom = (entity: string, endpoint: string, roomId: string | null, JWT: string | null) => {
  return useQuery([entity, endpoint, roomId], () => fetchItem(entity, endpoint, roomId, JWT), {
    enabled: !!JWT && roomId !== null,
  });
};

export default useGetAvailabilityByRoom;
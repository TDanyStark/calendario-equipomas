import { useQuery } from "react-query";
import { URL_BACKEND } from "../variables";
import axios from "axios";


const fetchItem = async (entity: string, endpoint: string, roomId: number | null,  JWT: string | null, idGroupClassEdit: number | null) => {
  const response = await axios.get(`${URL_BACKEND}${entity}${endpoint}?roomId=${roomId}&idGroupClassEdit=${idGroupClassEdit}`, {
    headers: {
      Authorization: `Bearer ${JWT}`,
    },
  });
  return response.data.data
};

const useGetAvailabilityByRoom = (entity: string, endpoint: string, roomId: number | null, JWT: string | null, idGroupClassEdit: number | null) => {
  return useQuery([entity, endpoint, roomId], () => fetchItem(entity, endpoint, roomId, JWT, idGroupClassEdit), {
    enabled: !!JWT && roomId !== null,
  });
};

export default useGetAvailabilityByRoom;
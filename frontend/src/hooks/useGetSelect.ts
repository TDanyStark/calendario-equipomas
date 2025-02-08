import { ResourceType } from "../types/Api";
import { useQuery } from "react-query";
import { URL_BACKEND } from "../variables";
import axios from "axios";

interface FetchItemsResponse<T> {
  map(arg0: (item: { id: string; name: string; }) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
  length: number;
  data: T[];
  pages: number;
}

const fetchItems = async <T,>(
  resource: ResourceType,
  JWT: string | null,
  query: string
): Promise<FetchItemsResponse<T>> => {
  const response = await axios.get(
    `${URL_BACKEND}${resource}/query?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    }
  );
  // Asegurar la estructura de respuesta esperada
  return response.data.data;
};

const useGetSelect = <T,>(
  resource: ResourceType,
  JWT: string | null,
  query: string
) => {
  return useQuery(
    [resource, query], // Incluir page y query en la key de la query
    () => fetchItems<T>(resource, JWT, query),
    {
      enabled: !!JWT,
    }
  );
};

export default useGetSelect;
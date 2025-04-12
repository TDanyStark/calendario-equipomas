import { ResourceType } from "../types/Api";
import { useQuery } from "react-query";
import { URL_BACKEND } from "../variables";
import axios from "axios";

interface FetchItemsResponse<T> {
  data: T[];
  pages: number;
}

const fetchItems = async <T>(
  resource: ResourceType,
  JWT: string | null,
  page: number,
  query: string,
): Promise<FetchItemsResponse<T>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    query: encodeURIComponent(query),
    // onlyActive: "true",
  });
  console.log(`${URL_BACKEND}${resource}?${params.toString()}`);
  const response = await axios.get(
    `${URL_BACKEND}${resource}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    }
  );
  // Asegurar la estructura de respuesta esperada
  return response.data.data;
};

const useGetDataForMiniTable = <T>(
  resource: ResourceType,
  JWT: string | null,
  page: number,
  debouncedQuery: string,
) => {
  return useQuery(
    [resource, page, debouncedQuery], // Incluir page y query en la key de la query
    () => fetchItems<T>(resource, JWT, page, debouncedQuery),
    {
      enabled: !!JWT,
      keepPreviousData: true, // Mejor experiencia durante paginación
      retry: 1,
    }
  );
};

export default useGetDataForMiniTable;

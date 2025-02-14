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
  filters: Record<string, unknown> = {}
): Promise<FetchItemsResponse<T>> => {
  const params = new URLSearchParams();
  // Agregar filtros a los parámetros de la URL
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value.toString());
  });
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

const useFetchWithFilters = <T>(
  resource: ResourceType,
  JWT: string | null,
  filters: Record<string, unknown> = {}
) => {
  return useQuery(
    [resource, filters], // Incluir page y query en la key de la query
    () => fetchItems<T>(resource, JWT, filters),
    {
      enabled: !!JWT,
      keepPreviousData: true, // Mejor experiencia durante paginación
      retry: 1,
    }
  );
};

export default useFetchWithFilters;

import { ResourceType } from "../types/Api";
import { useMutation, useQueryClient } from "react-query";
import { URL_BACKEND } from "../variables";
import axios from "axios";
import { toast } from "react-toastify";



const useItemMutations = <T extends { id: string }>(resource: ResourceType, JWT: string | null) => {
  const queryClient = useQueryClient();
  
  const createItem = useMutation(
    (newItem: T) =>
      axios.post(`${URL_BACKEND}${resource}`, newItem, {
        headers: { Authorization: `Bearer ${JWT}` },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(resource);
        toast.success(`${resource} creado exitosamente`);
        toast.clearWaitingQueue();
      },
      onError: () => {
        toast.error(`Error creando el ${resource}`);
        toast.clearWaitingQueue();
      },
    }
  );
  
  // Similar para updateItem y deleteItem
  const updateItem = useMutation(
    (updatedItem: T) =>
      axios.put(`${URL_BACKEND}${resource}/${updatedItem.id}`, updatedItem, {
        headers: { Authorization: `Bearer ${JWT}` },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(resource);
        toast.success(`${resource} actualizado exitosamente`);
        toast.clearWaitingQueue();
      },
      onError: () => {
        toast.error(`Error actualizando el ${resource}`);
        toast.clearWaitingQueue();
      },
    }
  );

  const deleteItem = useMutation(
    (id: string) =>
      axios.delete(`${URL_BACKEND}${resource}/${id}`, {
        headers: { Authorization: `Bearer ${JWT}` },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(resource);
        toast.success(`${resource} eliminado exitosamente`);
        toast.clearWaitingQueue();
      },
      onError: () => {
        toast.error(`Error eliminando el ${resource}`);
        toast.clearWaitingQueue();
      },
    }
  );

  const deleteItems = useMutation(
    (ids: string[]) =>
      axios.delete(`${URL_BACKEND}${resource}`,{
        headers: { Authorization: `Bearer ${JWT}` },
        data: { ids },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(resource);
        toast.success(`${resource} eliminados exitosamente`);
        toast.clearWaitingQueue();
      },
      onError: () => {
        toast.error(`Error eliminando los ${resource}`);
        toast.clearWaitingQueue();
      },
    }
  );
  
  return { createItem, updateItem, deleteItem, deleteItems };
};

export default useItemMutations;
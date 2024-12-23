import { ResourceType } from "../types/Api";
import { useMutation, useQueryClient } from "react-query";
import { URL_BACKEND } from "../variables";
import axios from "axios";
import { toast } from "react-toastify";

const useItemMutations = <T extends { id: string }>(
  resource: ResourceType,
  JWT: string | null,
  setIsOpen?: (state: boolean) => void
) => {
  const queryClient = useQueryClient();

  // Create Mutation
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
        if (setIsOpen) {
          setIsOpen(false);
        }
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage = error.response.data?.data?.error || "Error desconocido";
          toast.error(`Error creando el ${resource}: ${errorMessage}`);
        } else {
          toast.error(`Error creando el ${resource}`);
        }
        toast.clearWaitingQueue();
      },
    }
  );

  // Update Mutation
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
        if (setIsOpen) {
          setIsOpen(false);
        }
      },
      onError: () => {
        toast.error(`Error actualizando el ${resource}`);
        toast.clearWaitingQueue();
      },
    }
  );

  // Delete Single Item Mutation
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

  // Delete Multiple Items Mutation
  const deleteItems = useMutation(
    (ids: string[]) =>
      axios.delete(`${URL_BACKEND}${resource}`, {
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

  // Retornar el estado de carga junto con las mutaciones
  return {
    createItem,
    isCreateLoading: createItem.isLoading,
    updateItem,
    isUpdateLoading: updateItem.isLoading,
    deleteItem,
    isDeleteLoading: deleteItem.isLoading,
    deleteItems,
    isDeleteItemsLoading: deleteItems.isLoading,
  };
};

export default useItemMutations;

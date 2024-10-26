import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Loader } from "../components/Loader/Loader";
import { Room } from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import useFetchItems from "../hooks/useFetchItems";
import DataTable from "../components/table/DataTable";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import SubmitModalBtn from "../components/buttons/SubmitModalBtn";
import ErrorLoadingResourse from "../components/error/ErrorLoadingResourse";

const entity = "rooms";
const entityName = "salones";

const Rooms = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  // Obtener el token desde el store
  const JWT = useSelector((state: RootState) => state.auth.JWT);

  // Fetch rooms data
  const { data: rooms, isLoading, isError } = useFetchItems(entity, JWT);

  const memorizedData = useMemo(() => rooms, [rooms]);
  // Manejo del formulario con react-hook-form
  const { register, handleSubmit, setValue, reset } = useForm<Room>();

  const onSubmit = (data: Room) => {
    if (editRoom) {
      updateItem.mutate({
        id: editRoom.id,
        name: data.name,
        capacity: data.capacity,
      });
      reset();
    } else {
      createItem.mutate(data);
      reset();
    }
    setIsOpen(false);
  };

  // Mutaciones
  const { createItem, updateItem, deleteItem, deleteItems } =
    useItemMutations<Room>(entity, JWT);

  const handleCreate = useCallback(() => {
    setEditRoom(null);
    setIsOpen(true);
    reset();
  }, [reset]);

  const handleEdit = useCallback(
    (item: Room) => {
      setEditRoom(item);
      setIsOpen(true);
      setValue("name", item.name);
      setValue("capacity", item.capacity);
    },
    [setValue]
  );

  const handleDelete = useCallback(
    (item: Room) => {
      deleteItem.mutate((item as Room).id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleDeleteSelected = useCallback(
    (selectedIds: React.Key[]) => {
      const stringIds = selectedIds.map((id) => id.toString());
      deleteItems.mutate(stringIds);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const columns = useMemo(
    () => [
      {
        label: "ID",
        sortKey: "id",
        renderCell: (item: unknown) => (item as Room).id as string | number,
      },
      {
        label: "Nombre del Salón",
        sortKey: "name",
        renderCell: (item: unknown) => (item as Room).name as string,
      },
      {
        label: "Capacidad",
        sortKey: "capacity",
        renderCell: (item: unknown) => (item as Room).capacity as number,
      },
    ],
    []
  );

  if (isLoading) return <Loader />;
  if (isError) return <ErrorLoadingResourse resourse={entityName} />;

  return (
    <section className="section_page">
      <Primaryh1>Salones</Primaryh1>
      {/* @ts-expect-error: DataTable is a generic component */}
      <DataTable<Room>
        data={memorizedData || []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteSelected={handleDeleteSelected}
        searchPlaceholder="Buscar salón"
        TextButtonCreate="salón"
        gridTemplateColumns="100px 100px 1fr 180px 180px"
      />

      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <BackgroundDiv />
          <div className="modal_container">
            <DialogPanel className="dialog_panel">
              <div className="modal_header">
                <DialogTitle className="dialog_title">
                  {editRoom ? "Editar Salón" : "Crear Salón"}
                </DialogTitle>
                <CloseModalBtn onClick={() => setIsOpen(false)} />
              </div>

              <form
                id={`form-${entity}`}
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4"
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="name">
                    Nombre del Salón
                  </label>
                  <input
                    id="name"
                    {...register("name", { required: true })}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" htmlFor="capacity">
                    Capacidad
                  </label>
                  <input
                    id="capacity"
                    {...register("capacity", { required: true, valueAsNumber: true })}
                    className="input-primary w-full"
                    type="number"
                    min={1}
                  />
                </div>
              </form>

              <div className="modal_footer">
                <CancelModalBtn onClick={() => setIsOpen(false)} />
                <SubmitModalBtn
                  text={editRoom ? "Actualizar" : "Crear"}
                  form={`form-${entity}`}
                />
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}

      <ToastContainer theme="dark" limit={1} />
    </section>
  );
};

export default Rooms;

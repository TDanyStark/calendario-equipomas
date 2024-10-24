import { useForm } from "react-hook-form";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Loader } from "../components/Loader/Loader";
import { Instrument } from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import useFetchItems from "../hooks/useFetchItems";
import DataTable from "../components/table/DataTable";
import Primaryh1 from "../components/titles/Primaryh1";

const Instruments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editInstrument, setEditInstrument] = useState<Instrument | null>(null);

  // Obtener el token desde el store
  const JWT = useSelector((state: RootState) => state.auth.JWT);

  // Fetch instruments data
  const {
    data: instruments,
    isLoading,
    isError,
  } = useFetchItems("instruments", JWT);

  // Mutaciones
  const { createItem, updateItem, deleteItem, deleteItems } =
    useItemMutations<Instrument>("instruments", JWT);

  // Manejo del formulario con react-hook-form
  const { register, handleSubmit, setValue, reset } = useForm<Instrument>();

  const onSubmit = (data: Instrument) => {
    if (editInstrument) {
      updateItem.mutate({
        id: editInstrument.id,
        instrumentName: data.instrumentName,
      });
      reset();
    } else {
      createItem.mutate(data);
      reset();
    }
    setIsOpen(false);
  };

  const handleCreate = () => {
    setEditInstrument(null);
    setIsOpen(true);
    reset();
  };

  const handleEdit = (item: Instrument) => {
    setEditInstrument(item);
    setIsOpen(true);
    setValue("instrumentName", item.instrumentName);
  };

  const handleDelete = (item: Instrument) => {
    deleteItem.mutate(item.id);
  };

  const handleDeleteSelected = (selectedIds: React.Key[]) => {
    const stringIds = selectedIds.map(id => id.toString());
    deleteItems.mutate(stringIds);
  };
  const columns = [
    {
      label: "ID",
      sortKey: "id",
      renderCell: (item: Instrument) => item.id,
    },
    {
      label: "Instrumento",
      sortKey: "instrumentName",
      renderCell: (item: Instrument) => item.instrumentName,
    },
    // Puedes agregar más columnas si es necesario
  ];
  // Si hay error o está cargando
  if (isLoading) return <Loader />;
  if (isError) return <p>Error cargando instrumentos.</p>;

  return (
    <section className="p-4 flex flex-col gap-6">
      <Primaryh1>Instrumentos</Primaryh1>

      <DataTable
        data={instruments || []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteSelected={handleDeleteSelected}
        searchPlaceholder="Buscar instrumento"
        TextButtonCreate="instrumento"
        gridTemplateColumns="100px 100px 1fr 180px"
      />

      {/* Modal para crear o editar instrumento */}
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-principal-bg bg-opacity-80" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="bg-principal-bg border border-white border-opacity-40 rounded-lg p-6 w-full max-w-md">
              <DialogTitle className="text-lg font-bold">
                {editInstrument ? "Editar Instrumento" : "Crear Instrumento"}
              </DialogTitle>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="InstrumentName"
                  >
                    Nombre del Instrumento
                  </label>
                  <input
                    id="InstrumentName"
                    {...register("instrumentName", { required: true })}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editInstrument ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>
      )}

      <ToastContainer theme="dark" limit={1} />
    </section>
  );
};

export default Instruments;

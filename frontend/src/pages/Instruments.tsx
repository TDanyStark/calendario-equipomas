import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Loader } from "../components/Loader/Loader";
import { InstrumentType } from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import useFetchItems from "../hooks/useFetchItems";
import DataTable from "../components/table/DataTable";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import SubmitModalBtn from "../components/buttons/SubmitModalBtn";
import ErrorLoadingResourse from "../components/error/ErrorLoadingResourse";

const entity = "instruments";
const entityName = "instrumentos"

const Instruments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editInstrument, setEditInstrument] = useState<InstrumentType | null>(
    null
  );

  // Obtener el token desde el store
  const JWT = useSelector((state: RootState) => state.auth.JWT);

  // Fetch instruments data
  const { data: instruments, isLoading, isError } = useFetchItems(entity, JWT);
  
  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const memorizedData = useMemo(() => instruments, [instruments]);
  // Manejo del formulario con react-hook-form
  const { register, handleSubmit, setValue, reset } = useForm<InstrumentType>();

  const onSubmit = (data: InstrumentType) => {
    if (editInstrument) {
      updateItem.mutate({
        id: editInstrument.id,
        name: data.name,
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
    useItemMutations<InstrumentType>(entity, JWT);

    // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleCreate = useCallback(() => {
    setEditInstrument(null);
    setIsOpen(true);
    reset();
  }, [reset]);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleEdit = useCallback(
    (item: InstrumentType) => {
      setEditInstrument(item);
      setIsOpen(true);
      setValue("name", item.name);
    },
    [setValue]
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleDelete = useCallback(
    (item: InstrumentType) => {
      deleteItem.mutate((item as InstrumentType).id);
    },
    // aqui los desactivamos porque no entiendo porque detecta que deleteItem cambia en cada renderizado, si no cambia
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleDeleteSelected = useCallback(
    (selectedIds: React.Key[]) => {
      const stringIds = selectedIds.map((id) => id.toString());
      deleteItems.mutate(stringIds);
    },
    // aqui los desactivamos porque no entiendo porque detecta que deleteItems cambia en cada renderizado, si no cambia
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const columns = useMemo(
    () => [
      {
        label: "ID",
        sortKey: "id",
        renderCell: (item: unknown) =>
          (item as InstrumentType).id as string | number,
      },
      {
        label: "Instrumento",
        sortKey: "name",
        renderCell: (item: unknown) =>
          (item as InstrumentType).name as string | number,
      },
    ],
    []
  );

  // Si hay error o está cargando
  if (isLoading) return <Loader />;
  if (isError) return <ErrorLoadingResourse resourse={entityName} />;

  return (
    <section className="section_page">
      <Primaryh1>Instrumentos</Primaryh1>
      {/* esto lo colocamos porque hay como un bug del editor, dice que Datatable no expera ningun tipo, lo cual es un error dado que recibe ,<T */}
      {/* @ts-expect-error: DataTable is a generic component */}
      <DataTable<InstrumentType>

        data={memorizedData || []}
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
          <BackgroundDiv />
          <div className="modal_container">
            <DialogPanel className="dialog_panel">
              <div className="modal_header">
                <DialogTitle className="dialog_title">
                  {editInstrument ? "Editar Instrumento" : "Crear Instrumento"}
                </DialogTitle>
                <CloseModalBtn onClick={() => setIsOpen(false)} />
              </div>

              <form
                id={`form-${entity}`}
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4"
              >
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="name"
                  >
                    Nombre del Instrumento
                  </label>
                  <input
                    id="name"
                    {...register("name", { required: true })}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
              </form>

              <div className="modal_footer">
                <CancelModalBtn onClick={() => setIsOpen(false)} />
                <SubmitModalBtn
                  text={editInstrument ? "Actualizar" : "Crear"}
                  form={`form-${entity}`}
                />
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}

    </section>
  );
};

export default Instruments;

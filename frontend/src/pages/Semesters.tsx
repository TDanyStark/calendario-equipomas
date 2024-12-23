import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Loader } from "../components/Loader/Loader";
import { SemesterType } from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import useFetchItems from "../hooks/useFetchItems";
import DataTable from "../components/table/DataTable";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import SubmitModalBtn from "../components/buttons/SubmitModalBtn";
import ErrorLoadingResourse from "../components/error/ErrorLoadingResourse";

const entity = "semesters";
const entityName = "semestres";

const Semesters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editSemester, setEditSemester] = useState<SemesterType | null>(null);

  // Obtener el token desde el store
  const JWT = useSelector((state: RootState) => state.auth.JWT);

  // Fetch semesters data
  const { data: semesters, isLoading, isError } = useFetchItems(entity, JWT);


  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const memorizedData = useMemo(() => semesters, [semesters]);

  // Manejo del formulario con react-hook-form
  const { register, handleSubmit, setValue, reset } = useForm<SemesterType>();

  const onSubmit = (data: SemesterType) => {
    if (editSemester) {
      updateItem.mutate({
        id: editSemester.id,
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
    useItemMutations<SemesterType>(entity, JWT);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleCreate = useCallback(() => {
    setEditSemester(null);
    setIsOpen(true);
    reset();
  }, [reset]);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleEdit = useCallback(
    (item: SemesterType) => {
      setEditSemester(item);
      setIsOpen(true);
      setValue("name", item.name);
    },
    [setValue]
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleDelete = useCallback(
    (item: SemesterType) => {
      deleteItem.mutate((item as SemesterType).id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleDeleteSelected = useCallback(
    (selectedIds: React.Key[]) => {
      const stringIds = selectedIds.map((id) => id.toString());
      deleteItems.mutate(stringIds);
    },
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
          (item as SemesterType).id as string | number,
      },
      {
        label: "Nombre del Semestre",
        sortKey: "name",
        renderCell: (item: unknown) => (item as SemesterType).name as string,
      },
    ],
    []
  );

  if (isLoading) return <Loader />;
  if (isError) return <ErrorLoadingResourse resourse={entityName} />;

  return (
    <section className="section_page">
      <Primaryh1>Semestres</Primaryh1>
      {/* @ts-expect-error: DataTable is a generic component */}
      <DataTable<SemesterType>
        data={memorizedData || []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteSelected={handleDeleteSelected}
        searchPlaceholder="Buscar semestre"
        TextButtonCreate="semestre"
        gridTemplateColumns="100px 100px 1fr 180px"
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
                  {editSemester ? "Editar Semestre" : "Crear Semestre"}
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
                    Nombre del Semestre
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
                  text={editSemester ? "Actualizar" : "Crear"}
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

export default Semesters;

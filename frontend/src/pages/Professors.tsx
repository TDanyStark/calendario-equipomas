import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Loader } from "../components/Loader/Loader";
import { ProfessorType } from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import useFetchItems from "../hooks/useFetchItems";
import DataTable from "../components/table/DataTable";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import SubmitModalBtn from "../components/buttons/SubmitModalBtn";
import ErrorLoadingResourse from "../components/error/ErrorLoadingResourse";

const entity = "professors";
const entityName = "profesores";

const Professors = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editProfessor, setEditProfessor] = useState<ProfessorType | null>(null);

  // Obtener el token desde el store
  const JWT = useSelector((state: RootState) => state.auth.JWT);

  // Fetch professors data
  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const { data: professors, isLoading, isError } = useFetchItems(entity, JWT);

  const { register, handleSubmit, setValue, reset } = useForm<ProfessorType>();

  const onSubmit = (data: ProfessorType) => {
    const cleanedData = {
      ...data,
    };

    if (editProfessor) {
      updateItem.mutate(cleanedData);
    } else {
      createItem.mutate(cleanedData);
    }
  };

  // Mutaciones
  const { createItem, isCreateLoading, updateItem, isUpdateLoading, deleteItem, deleteItems } =
    useItemMutations<ProfessorType>(entity, JWT, setIsOpen);
    // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleCreate = useCallback(() => {
    setEditProfessor(null);
    setIsOpen(true);
    reset();
  }, [reset]);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleEdit = useCallback(
    (item: ProfessorType) => {
      setEditProfessor(item);
      setIsOpen(true);
      setValue("firstName", item.firstName);
      setValue("lastName", item.lastName);
      setValue("id", item.id);
      setValue("phone", item.phone);
      setValue("status", item.status);
      setValue("user.email", item.user.email);
      setValue("user.password", ""); // La contraseña no se muestra
      setValue("user.roleID", item.user.roleID);
    },
    [setValue]
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleDelete = useCallback(
    (item: ProfessorType) => {
      deleteItem.mutate(item.id);
    },
    // eslint-disable-next-line
    []
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleDeleteSelected = useCallback(
    (selectedIds: React.Key[]) => {
      const stringIds = selectedIds.map((id) => id.toString());
      deleteItems.mutate(stringIds);
    },
    // eslint-disable-next-line
    []
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const columns = useMemo(
    () => [
      {
        label: "ID",
        sortKey: "id",
        renderCell: (item: unknown) => (item as ProfessorType).id,
      },
      {
        label: "Nombre",
        sortKey: "firstName",
        renderCell: (item: unknown) => (item as ProfessorType).firstName,
      },
      {
        label: "Apellido",
        sortKey: "lastName",
        renderCell: (item: unknown) => (item as ProfessorType).lastName,
      },
      {
        label: "Teléfono",
        sortKey: "phone",
        renderCell: (item: unknown) => (item as ProfessorType).phone || "No disponible",
      },
      {
        label: "Estado",
        sortKey: "status",
        renderCell: (item: unknown) => (item as ProfessorType).status,
      },
    ],
    []
  );

  if (isLoading) return <Loader />;
  if (isError) return <ErrorLoadingResourse resourse={entityName} />;

  return (
    <section className="section_page">
      <Primaryh1>Profesores</Primaryh1>
      {/* @ts-expect-error: DataTable is a generic component */}
      <DataTable<ProfessorType>
        data={professors || []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteSelected={handleDeleteSelected}
        searchPlaceholder="Buscar profesor"
        TextButtonCreate="profesor"
        gridTemplateColumns="50px 180px 1fr 1fr 1fr 180px 150px"
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
                  {editProfessor ? "Editar Profesor" : "Crear Profesor"}
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
                    htmlFor="id"
                    className="block text-sm font-medium mb-1"
                  >
                    Cédula
                  </label>
                  <input
                    id="id"
                    {...register("id", { required: true })}
                    className={`w-full ${editProfessor ? 'input-disabled' : 'input-primary'}`}
                    type="text"
                    disabled={editProfessor ? true : false}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1"
                  >
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    {...register("firstName", { required: true })}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1"
                  >
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    {...register("lastName", { required: true })}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
                
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1"
                  >
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    {...register("phone")}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium mb-1"
                  >
                    Estado
                  </label>
                  <select
                    id="status"
                    {...register("status", { required: true })}
                    className="input-primary w-full"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    {...register("user.email", { required: true })}
                    className="input-primary w-full"
                    type="email"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    {...register("user.password")}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
                
              </form>


              <div className="modal_footer">
                <CancelModalBtn onClick={() => setIsOpen(false)} />
                <SubmitModalBtn
                  text={editProfessor ? "Actualizar" : "Crear"}
                  form={`form-${entity}`}
                  isLoading={isCreateLoading || isUpdateLoading}
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

export default Professors;

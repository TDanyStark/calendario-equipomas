import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  ProfessorType,
} from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import SubmitModalBtn from "../components/buttons/SubmitModalBtn";
import DataTablePagination from "../components/TablePagination";

const entity = "professors";
const entityName = "profesores";

const Professors = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editProfessor, setEditProfessor] = useState<ProfessorType | null>(null);
  const JWT = useSelector((state: RootState) => state.auth.JWT);

  const { register, handleSubmit, reset, setFocus } = useForm<ProfessorType>();
  // Observamos el valor del checkbox

  const onSubmit = (data: ProfessorType) => {
    // validar que existe aunque sea un dia activo en el horario
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
  const {
    createItem,
    isCreateLoading,
    updateItem,
    isUpdateLoading,
    deleteItem,
    deleteItems,
  } = useItemMutations<ProfessorType>(entity, JWT, setIsOpen);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleCreate = useCallback(() => {
    setEditProfessor(null);
    setIsOpen(true);
    reset({
      id: "",
      firstName: "",
      lastName: "",
      phone: "",
      status: "activo",
      user: { email: "" },
    });
    setTimeout(() => {
      setFocus("id"); // Enfoca el campo de nombre
    }, 0);
  }, [reset, setFocus]);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleEdit = useCallback(
    (item: ProfessorType) => {
      setEditProfessor(item);
      setIsOpen(true);
  
      reset({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        phone: item.phone,
        status: item.status,
        user: { email: item.user.email },
      });
      setTimeout(() => {
        setFocus("firstName"); // Enfoca el campo de nombre
      }, 0);
    },
    [reset, setFocus]
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
        renderCell: (item: unknown) =>
          (item as ProfessorType).phone || "No disponible",
      },
      {
        label: "Estado",
        sortKey: "status",
        renderCell: (item: unknown) => (item as ProfessorType).status,
      },
    ],
    []
  );

  return (
    <section className="section_page">
      <Primaryh1>Profesores</Primaryh1>
      <DataTablePagination<ProfessorType>
        entity={entity}
        entityName={entityName}
        JWT={JWT}
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
                    className={`w-full ${
                      editProfessor ? "input-disabled" : "input-primary"
                    }`}
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
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
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

      <ToastContainer theme="dark" limit={2} />
    </section>
  );
};

export default Professors;

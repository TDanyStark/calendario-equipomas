import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { StudentType } from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import DataTablePagination from "../components/TablePagination";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import SubmitModalBtn from "../components/buttons/SubmitModalBtn";

const entity = "students";
const entityName = "estudiantes";

const Students = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<StudentType | null>(null);

  const JWT = useSelector((state: RootState) => state.auth.JWT);

  const { register, handleSubmit, setValue, reset } = useForm<StudentType>();

  const onSubmit = (data: StudentType) => {
    const cleanedData = {
      ...data,
    };

    if (editStudent) {
      updateItem.mutate(cleanedData);
    } else {
      createItem.mutate(cleanedData);
    }
  };

  const {
    createItem,
    isCreateLoading,
    updateItem,
    isUpdateLoading,
    deleteItem,
    deleteItems,
  } = useItemMutations<StudentType>(entity, JWT, setIsOpen);

  const handleCreate = useCallback(() => {
    setEditStudent(null);
    setIsOpen(true);
    reset();
  }, [reset]);

  const handleEdit = useCallback(
    async (item: StudentType) => {
      setEditStudent(item);
      setValue("id", item.id);
      setValue("firstName", item.firstName);
      setValue("lastName", item.lastName);
      setValue("phone", item.phone);
      setValue("user.email", item.user.email);
      setValue("status", item.status);
      setIsOpen(true);
    },
    [setValue]
  );

  const handleDelete = useCallback(
    (item: StudentType) => {
      deleteItem.mutate(item.id);
    },
    [deleteItem]
  );

  const handleDeleteSelected = useCallback(
    (selectedIds: React.Key[]) => {
      const stringIds = selectedIds.map((id) => id.toString());
      deleteItems.mutate(stringIds);
    },
    [deleteItems]
  );

  const columns = useMemo(
    () => [
      {
        label: "ID",
        sortKey: "id",
        renderCell: (item: unknown) => (item as StudentType).id,
      },
      {
        label: "Nombre",
        sortKey: "StudentFirstName",
        renderCell: (item: unknown) => (item as StudentType).firstName,
      },
      {
        label: "Apellido",
        sortKey: "StudentLastName",
        renderCell: (item: unknown) => (item as StudentType).lastName,
      },
      {
        label: "Teléfono",
        sortKey: "StudentPhone",
        renderCell: (item: unknown) =>
          (item as StudentType).phone || "No disponible",
      },
      {
        label: "Estado",
        sortKey: "StudentStatus",
        renderCell: (item: unknown) => (item as StudentType).status,
      },
    ],
    []
  );

  return (
    <section className="section_page">
      <Primaryh1>Estudiantes</Primaryh1>
      <DataTablePagination<StudentType>
          entity={entity}
          entityName={entityName}
          JWT={JWT}
          columns={columns}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteSelected={handleDeleteSelected}
          searchPlaceholder="Buscar estudiante"
          TextButtonCreate="estudiante"
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
                  {editStudent ? "Editar Estudiante" : "Crear Estudiante"}
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
                      editStudent ? "input-disabled" : "input-primary"
                    }`}
                    type="text"
                    disabled={!!editStudent}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="StudentFirstName"
                    className="block text-sm font-medium mb-1"
                  >
                    Nombre
                  </label>
                  <input
                    id="StudentFirstName"
                    {...register("firstName", { required: true })}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="StudentLastName"
                    className="block text-sm font-medium mb-1"
                  >
                    Apellido
                  </label>
                  <input
                    id="StudentLastName"
                    {...register("lastName", { required: true })}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="StudentPhone"
                    className="block text-sm font-medium mb-1"
                  >
                    Teléfono
                  </label>
                  <input
                    id="StudentPhone"
                    {...register("phone")}
                    className="input-primary w-full"
                    type="text"
                  />
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
                    htmlFor="StudentStatus"
                    className="block text-sm font-medium mb-1"
                  >
                    Estado
                  </label>
                  <select
                    id="StudentStatus"
                    {...register("status", { required: true })}
                    className="input-primary w-full"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </form>
              <div className="modal_footer">
                <CancelModalBtn onClick={() => setIsOpen(false)} />
                <SubmitModalBtn
                  text={editStudent ? "Actualizar" : "Crear"}
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

export default Students;

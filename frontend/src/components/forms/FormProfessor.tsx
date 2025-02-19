import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import BackgroundDiv from "../modal/BackgroundDiv";
import CancelModalBtn from "../buttons/CancelModalBtn";
import SubmitModalBtn from "../buttons/SubmitModalBtn";
import CloseModalBtn from "../buttons/CloseModalBtn";
import { ProfessorType } from "@/types/Api";


interface FormProfessorProps {
  isOpen: boolean;
  onClose: () => void;
  editProfessor: ProfessorType | null;
  onFormSubmit: (data: ProfessorType) => void;
  isLoading: boolean;
}

const FormProfessor = ({
  isOpen,
  onClose,
  editProfessor,
  onFormSubmit,
  isLoading,
}: FormProfessorProps) => {
  const { register, handleSubmit, reset, setFocus } = useForm<ProfessorType>();

  useEffect(() => {
    if (isOpen) {
      const initialData = editProfessor
        ? {
            id: editProfessor.id,
            firstName: editProfessor.firstName,
            lastName: editProfessor.lastName,
            phone: editProfessor.phone,
            status: editProfessor.status,
            user: { email: editProfessor.user.email },
          }
        : {
            id: "",
            firstName: "",
            lastName: "",
            phone: "",
            status: "activo",
            user: { email: "" },
          };

      reset(initialData);

      setTimeout(() => {
        if (editProfessor) {
          setFocus("firstName");
        } else {
          setFocus("id");
        }
      }, 0);
    }
  }, [isOpen, editProfessor, reset, setFocus]);

  const onSubmit = (data: ProfessorType) => {
    onFormSubmit(data);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <BackgroundDiv />
      <div className="modal_container">
        <DialogPanel className="dialog_panel">
          <div className="modal_header">
            <DialogTitle className="dialog_title">
              {editProfessor ? "Editar Profesor" : "Crear Profesor"}
            </DialogTitle>
            <CloseModalBtn onClick={onClose} />
          </div>

          <form id="form-professor" onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="mb-4">
              <label htmlFor="id" className="block text-sm font-medium mb-1">
                Cédula
              </label>
              <input
                id="id"
                {...register("id", { required: true })}
                className={`w-full ${
                  editProfessor ? "input-disabled" : "input-primary"
                }`}
                type="text"
                disabled={!!editProfessor}
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
            <div className="modal_footer">
              <CancelModalBtn onClick={onClose} />
              <SubmitModalBtn
                text={editProfessor ? "Actualizar" : "Crear"}
                isLoading={isLoading}
                form="form-professor"
              />
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FormProfessor;
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import CancelModalBtn from "../buttons/CancelModalBtn";
import SubmitModalBtn from "../buttons/SubmitModalBtn";
import BackgroundDiv from "../modal/BackgroundDiv";
import CloseModalBtn from "../buttons/CloseModalBtn";
import { useForm } from "react-hook-form";
import { AcademicPeriodType } from "@/types/Api";
import { toast } from "react-toastify";
import { useState } from "react";

export interface PopupCreateProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const PopupCreate = ({ isOpen, setIsOpen }: PopupCreateProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AcademicPeriodType>();

  const [isSaving, setIsSaving] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const isFirstSemester = currentMonth < 6;

  const onSubmit = async (data: AcademicPeriodType) => {
    const { year, semester } = data;

    // Validar que el año sea el actual o el próximo
    if (year < currentYear || year > currentYear + 1) {
      toast.error("El año debe ser el actual o el próximo");
      return;
    }

    setIsSaving(true);
    try {
      // Aquí iría la lógica para crear el nuevo período académico
      // await createAcademicPeriod({ year, semester });

      toast.success("Período académico creado con éxito!");
      setIsOpen(false);
      reset(); // Limpiar el formulario después de enviar
    } catch (error) {
      toast.error("Error al crear el período académico");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
              Crear Periodo Academico
            </DialogTitle>
            <CloseModalBtn onClick={() => setIsOpen(false)} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="form-create-AP">
            <div>
              <label className="block text-sm font-medium">
                Año
              </label>
              <input
                type="number"
                className={`mt-1 block w-full border ${
                  errors.year ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm p-2`}
                {...register("year", {
                  required: "El año es obligatorio",
                  min: {
                    value: currentYear,
                    message: `El año no puede ser menor a ${currentYear}`,
                  },
                  max: {
                    value: currentYear + 1,
                    message: `El año no puede ser mayor a ${currentYear + 1}`,
                  },
                })}
                defaultValue={isFirstSemester ? currentYear : currentYear + 1}
              />
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.year.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium ">
                Semestre
              </label>
              <select
                className={`mt-1 block w-full border ${
                  errors.semester ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm p-2`}
                {...register("semester", {
                  required: "El semestre es obligatorio",
                })}
                defaultValue={isFirstSemester ? 2 : 1}
              >
                <option value="">Selecciona un semestre</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
              {errors.semester && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.semester.message}
                </p>
              )}
            </div>
            
          </form>

          <div className="modal_footer">
            <CancelModalBtn onClick={() => setIsOpen(false)} />
            <SubmitModalBtn isLoading={isSaving} text="Crear" form={`form-create-AP`} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default PopupCreate;

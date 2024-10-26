import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Loader } from "../components/Loader/Loader";
import { CourseType } from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import useFetchItems from "../hooks/useFetchItems";
import DataTable from "../components/table/DataTable";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import SubmitModalBtn from "../components/buttons/SubmitModalBtn";
import ErrorLoadingResourse from "../components/error/ErrorLoadingResourse";
import useFetchDaysOfWeek from "../hooks/useFetchDaysOfWeek";


const entity = "courses";
const entityName = "cursos";

const Courses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseType | null>(null);

  // Obtener el token desde el store
  const JWT = useSelector((state: RootState) => state.auth.JWT);

   // Fetch courses data
  const { data: courses, isLoading, isError } = useFetchItems(entity, JWT);
  
  // @ts-expect-error: This variable is used but you can't see it in the code
  const memorizedData = useMemo(() => courses, [courses]);

  // Fetch días de la semana
  const {
    daysOfWeek,
    isLoading: loadingDays,
    isError: errorDays,
  } = useFetchDaysOfWeek();

  const { register, handleSubmit, setValue, reset, control } =
    useForm<CourseType>({
      defaultValues: {
        availability: [], // Inicializa vacío, para ser llenado después
      },
    });

  const { fields } = useFieldArray({
    control,
    name: "availability",
  });

  // Actualizar valores predeterminados del formulario cuando `daysOfWeek` esté disponible
  useEffect(() => {
    if (daysOfWeek.length > 0) {
      reset({
        availability: daysOfWeek.map((day) => ({
          dayOfWeek: day.dayName,
          startTime: null,
          endTime: null,
        })),
      });
    }
  }, [daysOfWeek, reset]);

  const onSubmit = (data: CourseType) => {
    const filteredAvailability = data.availability
    .filter(
      (day) => day.startTime !== null && day.endTime !== null
    )
    .map((day) => ({
      dayOfWeek: day.dayOfWeek,
      startTime: day.startTime,
      endTime: day.endTime,
    }));
    const cleanedData = {
      ...data,
      availability: filteredAvailability.length > 0 ? filteredAvailability : [],
    };
    console.log(cleanedData);
    // if (editCourse) {
    //   updateItem.mutate({
    //     id: editCourse.id,
    //     ...cleanedData,
    //   });
    //   reset();
    // } else {
    //   createItem.mutate(cleanedData);
    //   reset();
    // }
    // setIsOpen(false);
  };

  // Mutaciones
  const { createItem, updateItem, deleteItem, deleteItems } =
    useItemMutations<CourseType>(entity, JWT);

  // @ts-expect-error: This variable is used but you can't see it in the code
  const handleCreate = useCallback(() => {
    setEditCourse(null);
    setIsOpen(true);
    reset();
  }, [reset]);

  // @ts-expect-error: This variable is used but you can't see it in the code
  const handleEdit = useCallback(
    (item: CourseType) => {
      setEditCourse(item);
      setIsOpen(true);
      setValue("name", item.name);
      setValue("isOnline", item.isOnline);
      setValue("availability", item.availability);
    },
    [setValue]
  );

  // ignorar error de typescript
  // @ts-expect-error: This variable is used but you can't see it in the code
  const handleDelete = useCallback(
    (item: CourseType) => {
      deleteItem.mutate(item.id);
    },
    // eslint-disable-next-line
    []
  );

  // @ts-expect-error: This variable is used but you can't see it in the code
  const handleDeleteSelected = useCallback(
    (selectedIds: React.Key[]) => {
      const stringIds = selectedIds.map((id) => id.toString());
      deleteItems.mutate(stringIds);
    },
    // eslint-disable-next-line
    []
  );

  // @ts-expect-error: This variable is used but you can't see it in the code
  const columns = useMemo(
    () => [
      {
        label: "ID",
        sortKey: "id",
        renderCell: (item: unknown) => (item as CourseType).id,
      },
      {
        label: "Nombre del Curso",
        sortKey: "name",
        renderCell: (item: unknown) => (item as CourseType).name,
      },
      {
        label: "Tipo",
        sortKey: "isOnline",
        renderCell: (item: unknown) =>
          (item as CourseType).isOnline ? "Online" : "Presencial",
      },
      {
        label: "Duración",
        sortKey: "duration",
        renderCell: (item: unknown) => (item as CourseType).duration,
      },
    ],
    []
  );

  if (isLoading) return <Loader />;
  if (isError) return <ErrorLoadingResourse resourse={entityName} />;

  return (
    <section className="section_page">
      <Primaryh1>Cursos</Primaryh1>
      {/* @ts-expect-error: DataTable is a generic component */}
      <DataTable<CourseType>
        data={memorizedData || []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteSelected={handleDeleteSelected}
        searchPlaceholder="Buscar curso"
        TextButtonCreate="curso"
        gridTemplateColumns="100px 100px 1fr 100px 180px 180px"
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
                  {editCourse ? "Editar Curso" : "Crear Curso"}
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
                    Nombre del Curso
                  </label>
                  <input
                    id="name"
                    {...register("name", { required: true })}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    ¿Es Online?
                  </label>
                  <input
                    type="checkbox"
                    {...register("isOnline")}
                    className="input-checkbox"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Disponibilidad
                  </label>
                  {fields && fields.map((field, index: number) => (
                    <div key={field.id} className="flex items-center mb-2">
                      <span className="w-24">{daysOfWeek[index].dayDisplayName}:</span>
                      <Controller
                        control={control}
                        name={`availability.${index}.startTime`}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="time"
                            className="input-primary"
                            placeholder="Hora de inicio"
                          />
                        )}
                      />
                      <span className="mx-2">-</span>
                      <Controller
                        control={control}
                        name={`availability.${index}.endTime`}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="time"
                            className="input-primary"
                            placeholder="Hora de fin"
                          />
                        )}
                      />
                      <input
                        type="hidden"
                        {...register(`availability.${index}.dayOfWeek` as const)}
                        value={daysOfWeek[index].dayName}
                      />
                    </div>
                  ))}
                </div>
              </form>

              <div className="modal_footer">
                <CancelModalBtn onClick={() => setIsOpen(false)} />
                <SubmitModalBtn
                  text={editCourse ? "Actualizar" : "Crear"}
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

export default Courses;

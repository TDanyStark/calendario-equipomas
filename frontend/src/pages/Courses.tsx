import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
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
import SelectSchedule from "../components/selectSchedule";
import { SelectScheduleType } from "../types/Api";


const entity = "courses";
const entityName = "cursos";

const Courses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseType | null>(null);
  const [courseSchedule, setCourseSchedule] = useState<SelectScheduleType[]>([]);

  // Obtener el token desde el store
  const JWT = useSelector((state: RootState) => state.auth.JWT);

  // Fetch courses data
  const { data: courses, isLoading, isError } = useFetchItems(entity, JWT);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const memorizedData = useMemo(() => courses, [courses]);

  const { register, handleSubmit, setValue, reset } =
    useForm<CourseType>();

  const handleScheduleChange = useCallback(
    (newSchedule: SelectScheduleType[]) => {
      setCourseSchedule(newSchedule); // Actualizamos el estado local con el nuevo schedule
    },
    []
  );

  const onSubmit = (data: CourseType) => {
    console.log("ejecutando submit");
    const cleanedData = {
      ...data,
      id: "",
      availability: courseSchedule,
    };
    console.log(cleanedData);
    if (editCourse) {
      cleanedData.id = editCourse.id;
      updateItem.mutate(cleanedData);
    } else {
      createItem.mutate(cleanedData);
    }
    setIsOpen(false);
  };

  // Mutaciones
  const { createItem, updateItem, deleteItem, deleteItems } =
    useItemMutations<CourseType>(entity, JWT);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleCreate = useCallback(() => {
    setEditCourse(null);
    setIsOpen(true);
    reset();
  }, [reset]);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleEdit = useCallback(
    (item: CourseType) => {
      setEditCourse(item);
      setIsOpen(true);
      setValue("name", item.name);
      setValue("isOnline", item.isOnline);
      setValue("duration", item.duration);
    },
    [setValue]
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleDelete = useCallback(
    (item: CourseType) => {
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
        gridTemplateColumns="100px 100px 1fr 150px 150px 180px"
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
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
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
                    className="input-checkbox w-5 h-5"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Duracion en minutos
                  </label>
                  <input
                    type="number"
                    {...register("duration", { required: true })}
                    className="input-primary w-28"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Disponibilidad 
                  </label>
                  <p className="text-sm">(si la disponibilidad es todos los dias no es necesario seleccionar dias)</p>
                  <SelectSchedule<CourseType> onScheduleChange={handleScheduleChange} editItem={editCourse} />
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

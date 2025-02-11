import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { EnrollType } from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import DataTablePagination from "../components/TablePagination";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import SubmitModalBtn from "../components/buttons/SubmitModalBtn";
import SearchSelect from "../components/SearchSelect";

const entity = "enrolls";
const entityName = "matriculas";

const Enrolls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editEnroll, setEditEnroll] = useState<EnrollType | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<{ studentID: string; studentName: string }>({ studentID: '', studentName: '' });
  const [selectedCourse, setSelectedCourse] = useState<{ courseID: string; courseName: string }>({ courseID: '', courseName: '' });
  const [selectedSemester, setSelectedSemester] = useState<{ semesterID: string; semesterName: string }>({ semesterID: '', semesterName: '' });
  const [selectedInstrument, setSelectedInstrument] = useState<{ instrumentID: string; instrumentName: string }>({ instrumentID: '', instrumentName: '' });
  const [activeSearchSelect, setActiveSearchSelect] = useState<string | null>(
    null
  );

  const JWT = useSelector((state: RootState) => state.auth.JWT);

  const { register, handleSubmit, setValue, reset } = useForm<EnrollType>();

  const onSubmit = (data: EnrollType) => {
    const cleanedData = {
      ...data,
      id: editEnroll?.id || '',
      studentID: selectedStudent.studentID,
      studentName: selectedStudent.studentName,
      courseID: selectedCourse.courseID,
      courseName: selectedCourse.courseName,
      semesterID: selectedSemester.semesterID,
      semesterName: selectedSemester.semesterName,
      instrumentID: selectedInstrument.instrumentID,
      instrumentName: selectedInstrument.instrumentName,
    };

    if (!cleanedData.studentID) {
      return toast.error("Debes seleccionar un estudiante");
    }

    if (!cleanedData.courseID) { 
      return toast.error("Debes seleccionar un curso");
    }

    if (!cleanedData.semesterID) {
      return toast.error("Debes seleccionar un semestre");
    }

    if (!cleanedData.instrumentID) {
      return toast.error("Debes seleccionar un instrumento");
    }

    console.log(cleanedData);

    if (editEnroll) {
      updateItem.mutate(cleanedData);
    } else {
      createItem.mutate(cleanedData);
    }
  };

  const cleanData = () => {
    setSelectedStudent({ studentID: '', studentName: '' });
    setSelectedCourse({ courseID: '', courseName: '' });
    setSelectedSemester({ semesterID: '', semesterName: '' });
    setSelectedInstrument({ instrumentID: '', instrumentName: '' });
  }

  const {
    createItem,
    isCreateLoading,
    updateItem,
    isUpdateLoading,
    deleteItem,
    deleteItems,
  } = useItemMutations<EnrollType>(entity, JWT, setIsOpen);

  const handleCreate = useCallback(() => {
    setEditEnroll(null);
    setIsOpen(true);
    reset();
    setActiveSearchSelect(null);
    cleanData();
  }, [reset]);

  const handleEdit = useCallback(
    async (item: EnrollType) => {
      setEditEnroll(item);
      setSelectedStudent({ studentID: item.studentID, studentName: item.studentName });
      setSelectedCourse({ courseID: item.courseID, courseName: item.courseName });
      setSelectedSemester({ semesterID: item.semesterID, semesterName: item.semesterName });
      setSelectedInstrument({ instrumentID: item.instrumentID, instrumentName: item.instrumentName });
      setValue("status", item.status);
      setActiveSearchSelect(null);
      setIsOpen(true);
    },
    [setValue]
  );

  const handleDelete = useCallback(
    (item: EnrollType) => {
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
        renderCell: (item: unknown) => (item as EnrollType).id,
      },
      {
        label: "Estudiante",
        renderCell: (item: unknown) => (item as EnrollType).studentName,
      },
      {
        label: "Curso",
        renderCell: (item: unknown) => (item as EnrollType).courseName,
      },
      {
        label: "Semestre",
        renderCell: (item: unknown) => (item as EnrollType).semesterName,
      },
      {
        label: "Instrumento",
        renderCell: (item: unknown) => (item as EnrollType).instrumentName,
      },
      {
        label: "Estado",
        renderCell: (item: unknown) => (item as EnrollType).status,
      },
    ],
    []
  );

  return (
    <section className="section_page">
      <Primaryh1>Matriculas</Primaryh1>
      <DataTablePagination<EnrollType>
        entity={entity}
        entityName={entityName}
        JWT={JWT}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteSelected={handleDeleteSelected}
        searchPlaceholder="Buscar matriculas"
        TextButtonCreate="matricula"
        gridTemplateColumns="50px 70px 1fr 1fr 1fr 1fr 130px 130px"
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
                  {editEnroll ? "Editar Matricula" : "Crear Matricula"}
                </DialogTitle>
                <CloseModalBtn onClick={() => setIsOpen(false)} />
              </div>
              <form
                id={`form-${entity}`}
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4"
              >
                <div className="mb-4">
                  <span className="block text-sm font-medium mb-1">
                    Estudiante
                  </span>
                  {
                    editEnroll ? (
                      <p>
                        {editEnroll.studentName}
                      </p>
                    ) : (
                      <SearchSelect
                        entity="students"
                        defaultValue={selectedStudent.studentName}
                        onSelect={(id, name) => {
                          setSelectedStudent({ studentID: id, studentName: name });
                        }}
                        isActive={activeSearchSelect === "students"}
                        onFocus={() => setActiveSearchSelect("students")}
                        onClose={() => setActiveSearchSelect(null)}
                      />
                    )
                  }
                </div>
                <div className="mb-4">
                  <span className="block text-sm font-medium mb-1">Curso</span>
                  <SearchSelect
                    entity="courses"
                    defaultValue={editEnroll ? editEnroll.courseName : ''}
                    onSelect={(id, name) => {
                      setSelectedCourse({ courseID: id, courseName: name });
                    }}
                    isActive={activeSearchSelect === "courses"}
                    onFocus={() => setActiveSearchSelect("courses")}
                    onClose={() => setActiveSearchSelect(null)}
                  />
                </div>
                <div className="mb-4">
                  <span className="block text-sm font-medium mb-1">
                    Semestre
                  </span>
                  <SearchSelect
                    entity="semesters"
                    defaultValue={editEnroll ? editEnroll.semesterName : ''}
                    onSelect={(id, name) => {
                      setSelectedSemester({
                        semesterID: id,
                        semesterName: name,
                      });
                    }}
                    isActive={activeSearchSelect === "semesters"}
                    onFocus={() => setActiveSearchSelect("semesters")}
                    onClose={() => setActiveSearchSelect(null)}
                  />
                </div>
                <div className="mb-4">
                  <span className="block text-sm font-medium mb-1">
                    Instrumento
                  </span>
                  <SearchSelect
                    entity="instruments"
                    defaultValue={editEnroll ? editEnroll.instrumentName : ''}
                    onSelect={(id, name) => {
                      setSelectedInstrument({
                        instrumentID: id,
                        instrumentName: name,
                      });
                    }}
                    isActive={activeSearchSelect === "instruments"}
                    onFocus={() => setActiveSearchSelect("instruments")}
                    onClose={() => setActiveSearchSelect(null)}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="name"
                  >
                    Estado{" "}
                    <span className="font-normal">
                      (inactivo no puede escoger su horario de instrumento)
                    </span>
                  </label>
                  <select
                    id="status"
                    {...register("status", { required: true })}
                    className="input-primary w-full"
                  >
                    <option value="inactivo">Inactivo</option>
                    <option value="activo">Activo</option>
                  </select>
                </div>
              </form>
              <div className="modal_footer">
                <CancelModalBtn onClick={() => setIsOpen(false)} />
                <SubmitModalBtn
                  text={editEnroll ? "Actualizar" : "Crear"}
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

export default Enrolls;

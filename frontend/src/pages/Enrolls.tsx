import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
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
  const [selectedStudent, setSelectedStudent] = useState<object>({});
  const [selectedCourse, setSelectedCourse] = useState<object>({});
  const [selectedSemester, setSelectedSemester] = useState<object>({});
  const [selectedInstrument, setSelectedInstrument] = useState<object>({});



  const JWT = useSelector((state: RootState) => state.auth.JWT);

  const { register, handleSubmit, setValue, reset } = useForm<EnrollType>();

  const onSubmit = (data: EnrollType) => {
    const cleanedData = {
      ...data,
    };

    if (editEnroll) {
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
  } = useItemMutations<EnrollType>(entity, JWT, setIsOpen);

  const handleCreate = useCallback(() => {
    setEditEnroll(null);
    setIsOpen(true);
    reset();
  }, [reset]);

  const handleEdit = useCallback(
    async (item: EnrollType) => {
      setEditEnroll(item);
      setValue("id", item.id);
      setValue("studentName", item.studentName);
      setValue("courseName", item.courseName);
      setValue("semesterName", item.semesterName);
      setValue("instrumentName", item.instrumentName);
      setValue("status", item.status);
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
        renderCell: (item: unknown) =>
          (item as EnrollType).semesterName,
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
          TextButtonCreate="matriculas"
          gridTemplateColumns="50px 140px 1fr 1fr 1fr 130px 130px"
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
                  <SearchSelect entity="students" onSelect={(id, name) => {
                    setSelectedStudent({ studentID: id, studentName: name });
                  }} />
                </div>
                <div className="mb-4">
                  <span className="block text-sm font-medium mb-1">
                    Curso
                  </span>
                  <SearchSelect entity="courses" onSelect={(id, name) => {
                    setSelectedCourse({ courseID: id, courseName: name });
                  }} />
                </div>
                <div className="mb-4">
                  <span className="block text-sm font-medium mb-1">
                    Semestre
                  </span>
                  <SearchSelect entity="semesters" onSelect={(id, name) => {
                    setSelectedSemester({ semesterID: id, semesterName: name });
                  }} />
                </div>
                <div className="mb-4">
                  <span className="block text-sm font-medium mb-1">
                    Instrumento
                  </span>
                  <SearchSelect entity="instruments" onSelect={(id, name) => {
                    setSelectedInstrument({ instrumentID: id, instrumentName: name });
                  }} />
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

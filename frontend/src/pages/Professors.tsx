import { useState, useCallback, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  ProfessorType,
} from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import Primaryh1 from "../components/titles/Primaryh1";
import DataTablePagination from "../components/TablePagination";
import { NavLink } from "react-router-dom";
import FormProfessor from "@/components/forms/FormProfessor";

const entity = "professors";
const entityName = "profesores";

const Professors = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editProfessor, setEditProfessor] = useState<ProfessorType | null>(null);
  const JWT = useSelector((state: RootState) => state.auth.JWT);

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
  }, []);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleEdit = useCallback(
    (item: ProfessorType) => {
      setEditProfessor(item);
      setIsOpen(true);
    },
    []
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
      <div>
        <NavLink to="/professors/assign" className="btn-yellow">
          Asignar Profesores
        </NavLink>
      </div>
      {/* @ts-expect-error: no se porque no me reconoce que la estoy usando abajo */}
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

      <FormProfessor
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        editProfessor={editProfessor}
        onFormSubmit={onSubmit}
        isLoading={isCreateLoading || isUpdateLoading}
      />

      <ToastContainer theme="dark" limit={2} />
    </section>
  );
};

export default Professors;

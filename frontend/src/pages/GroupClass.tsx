import { useMemo, useState } from "react";
// import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"; // Commented out as unused
import "react-toastify/dist/ReactToastify.css";
import Primaryh1 from "../components/titles/Primaryh1";
// import CloseModalBtn from "../components/buttons/CloseModalBtn"; // Commented out as unused
// import BackgroundDiv from "../components/modal/BackgroundDiv"; // Commented out as unused
// import CancelModalBtn from "../components/buttons/CancelModalBtn"; // Commented out as unused
import FilterGroupClass from "@/components/Filters/FilterGroupClass";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ChangeAP from "@/components/ChangeAP";
import DataTablePagination from "@/components/TablePagination";
import { GroupClassType } from "@/types/Api";
import { to12HourFormat } from "@/utils/timeConversionUtils";
import useItemMutations from "@/hooks/useItemsMutation";

const entity = "groupclass";

const GroupClass = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseFilter = searchParams.get("course");
  const instrumentFilter = searchParams.get("instrument");
  const semesterFilter = searchParams.get("semester");
  const studentFilter = searchParams.get("student");
  const professorFilter = searchParams.get("professor");
  const roomFilter = searchParams.get("room");
  const [filterActive, setFilterActive] = useState<string | null>(null);

  const onShow = (filter: string) => {
    if (filterActive === filter) {
      setFilterActive(null);
    } else {
      setFilterActive(filter);
    }
  };

  const onShowSearchInput = (filter: string) => {
    setFilterActive(filter);
  };

  const onSelect = (id: string, filter: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(filter, id);
    setSearchParams(newParams);
    setFilterActive(null);
  };

  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("course");
    newParams.delete("instrument");
    newParams.delete("semester");
    newParams.delete("student");
    newParams.delete("professor");
    newParams.delete("room");
    setSearchParams(newParams);
  };

  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const { deleteItem, deleteItems } = useItemMutations<GroupClassType>(
    entity,
    JWT
  );

  const columns = useMemo(
    () => [
      {
        label: "ID",
        renderCell: (item: GroupClassType) => item.id,
      },
      {
        label: "Clase",
        renderCell: (item: GroupClassType) => item.name,
      },
      {
        label: "Salón",
        renderCell: (item: GroupClassType) => item.roomName || "-",
      },
      {
        label: "Día",
        renderCell: (item: GroupClassType) => item.dayDisplayName || "-",
      },
      {
        label: "Inicio",
        renderCell: (item: GroupClassType) => to12HourFormat(item.startTime),
      },
      {
        label: "Fin",
        renderCell: (item: GroupClassType) => to12HourFormat(item.endTime),
      },
    ],
    []
  );

  const filterComponent = (
    <FilterGroupClass
      courseFilter={courseFilter || ""}
      instrumentFilter={instrumentFilter || ""}
      semesterFilter={semesterFilter || ""}
      studentFilter={studentFilter || ""}
      professorFilter={professorFilter || ""}
      roomFilter={roomFilter || ""}
      filterActive={filterActive || ""}
      onShow={onShow}
      onShowSearchInput={onShowSearchInput}
      onSelect={onSelect}
      handleClearFilters={handleClearFilters}
      setFilterActive={setFilterActive}
    />
  );

  const handleCreate = () => {
    navigate("/group-class/create");
  };

  const handleEdit = (item: GroupClassType) => {
    navigate(`/group-class/edit/${item.id}`);
  };

  const handleDelete = async (item: GroupClassType) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar la clase grupal "${item.name}"?`
      )
    ) {
      try {
        await deleteItem.mutateAsync(item.id);
        // The useItemMutations hook handles success/error toasts and query invalidation.
      } catch (error) {
        console.error("Error deleting group class:", error);
      }
    }
  };

  const handleDeleteSelected = async (selectedIds: React.Key[]) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar ${selectedIds.length} clases grupales seleccionadas?`
      )
    ) {
      try {
        const stringIds = selectedIds.map((id) => String(id));
        await deleteItems.mutateAsync(stringIds);
        // The useItemMutations hook handles success/error toasts and query invalidation.
      } catch (error) {
        console.error("Error deleting selected group classes:", error);
      }
    }
  };

  return (
    <section className="section_page">
      <Primaryh1>Clases Grupales</Primaryh1>
      <ChangeAP />

      <DataTablePagination<GroupClassType>
        entity={entity}
        entityName="clases grupales"
        JWT={JWT}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteSelected={handleDeleteSelected}
        searchPlaceholder="Buscar clases grupales"
        TextButtonCreate="clase grupal"
        gridTemplateColumns="50px 70px 1fr 1fr 1fr 1fr 1fr 130px"
        filterComponent={filterComponent}
        showSearchBar={false}
      />
    </section>
  );
};

export default GroupClass;

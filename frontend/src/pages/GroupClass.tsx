import { useMemo, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import FilterGroupClass from "@/components/Filters/FilterGroupClass";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ChangeAP from "@/components/ChangeAP";
import DataTablePagination from "@/components/TablePagination";
import { GroupClassType } from "@/types/Api";
import { to12HourFormat } from "@/utils/timeConversionUtils";

const entity = "groupclass";
// const entityName = "clases grupales";

const GroupClass = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // Add useNavigate hook
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

  const columns = useMemo(() => [
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
  ], []);

  // Create the custom filter component
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
    navigate('/group-class/create');
  };

  const handleEdit = (item: GroupClassType) => {
    console.log("Edit item", item);
    // Implement edit functionality
  };

  const handleDelete = (item: GroupClassType) => {
    console.log("Delete item", item);
    // Implement delete functionality
  };

  const handleDeleteSelected = (selectedIds: React.Key[]) => {
    console.log("Delete selected items", selectedIds);
    // Implement delete selected functionality
  };

  return (
    <section className="section_page">
      <Primaryh1>Clases Grupales</Primaryh1>
      <ChangeAP />
      
      {/* Use DataTablePagination instead of custom implementation */}
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
        showSearchBar={false} // Hide search bar as we're managing search in the filter
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
                  Crear Clase Grupal
                </DialogTitle>
                <CloseModalBtn onClick={() => setIsOpen(false)} />
              </div>
              <div className="modal_footer">
                <CancelModalBtn onClick={() => setIsOpen(false)} />
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}

    </section>
  );
};

export default GroupClass;

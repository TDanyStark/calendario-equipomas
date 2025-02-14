import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import FilterGroupClass from "@/components/Filters/FilterGroupClass";
import { useSearchParams } from "react-router-dom";

const entity = "groupclass";
const entityName = "clases grupales";

const GroupClass = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const courseFilter = searchParams.get("course");
  const instrumentFilter = searchParams.get("instrument");
  const semesterFilter = searchParams.get("semester");
  const studentFilter = searchParams.get("student");
  const professorFilter = searchParams.get("professor");
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
  }

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
    setSearchParams(newParams);
  };

  return (
    <section className="section_page">
      <Primaryh1>Clases Grupales</Primaryh1>
      <div>
        <FilterGroupClass 
          courseFilter={courseFilter || ""}
          instrumentFilter={instrumentFilter || ""}
          semesterFilter={semesterFilter || ""}
          studentFilter={studentFilter || ""}
          professorFilter={professorFilter || ""}
          filterActive={filterActive || ""}
          onShow={onShow}
          onShowSearchInput={onShowSearchInput}
          onSelect={onSelect}
          handleClearFilters={handleClearFilters}
          setFilterActive={setFilterActive}
        />
        <button onClick={() => setIsOpen(true)} className="btn-primary">
          Crear Clase Grupal
        </button>
      </div>

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

      <ToastContainer theme="dark" limit={1} />
    </section>
  );
};

export default GroupClass;

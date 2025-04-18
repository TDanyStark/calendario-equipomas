import useEscapeKey from "@/hooks/useEscapeKey";
import SelectWithFetch from "../SelectWithFetch";
import SelectWithSearchParams from "../SelectWithFetch/SelectWithSearchParams";
import useClickOutside from "@/hooks/useClickOutside";
import { useRef } from "react";

interface Props{
  courseFilter: string;
  instrumentFilter: string;
  semesterFilter: string;
  studentFilter: string;
  professorFilter: string;
  filterActive: string;
  onShow: (entity: string) => void;
  onShowSearchInput: (entity: string) => void;
  onSelect: (id: string, entity: string) => void;
  handleClearFilters: () => void;
  setFilterActive: (entity: string | null) => void;
}

const FilterGroupClass = ({ 
  courseFilter,
  instrumentFilter,
  semesterFilter,
  studentFilter,
  professorFilter,
  filterActive,
  onShow,
  onShowSearchInput,
  onSelect,
  handleClearFilters,
  setFilterActive,}: Props) => {
    const selectsContainerRef = useRef<HTMLDivElement>(null);
    // Manejar la tecla Escape
    const handleEscape = () => setFilterActive(null);
  
    useEscapeKey(handleEscape);

  
    // Manejar clics fuera de los selects
    useClickOutside(selectsContainerRef, () =>  setFilterActive(null));
    return (
      <div
        ref={selectsContainerRef}
        className="pt-6 flex flex-col lg:flex-wrap lg:gap-y-4 lg:flex-row gap-3 w-fit select-none mx-auto lg:mx-0"
      >
        <SelectWithFetch
          entity="courses"
          displayName="Cursos"
          filter={courseFilter || undefined}
          isActive={filterActive === "courses"}
          onShow={() => onShow("courses")}
          onSelect={(id) => {
            onSelect(id, "course");
          }}
        />
        <SelectWithFetch
          entity="instruments"
          displayName="Instrumentos"
          filter={instrumentFilter || undefined}
          isActive={filterActive === "instruments"}
          onShow={() => onShow("instruments")}
          onSelect={(id) => {
            onSelect(id, "instrument");
          }}
        />
        <SelectWithFetch
          entity="semesters"
          displayName="Semestres"
          filter={semesterFilter || undefined}
          isActive={filterActive === "semesters"}
          onShow={() => onShow("semesters")}
          onSelect={(id) => {
            onSelect(id, "semester");
          }}
        />
        {/* students */}
        <SelectWithSearchParams
          entity="students"
          displayName="Estudiantes"
          filter={studentFilter || undefined}
          isActive={filterActive === "students"}
          onShow={() => onShowSearchInput("students")}
          onSelect={(id) => {
            onSelect(id, "student");
          }}
        />
        {/* professors */}
        <SelectWithSearchParams
          entity="professors"
          displayName="Profesores"
          filter={professorFilter || undefined}
          isActive={filterActive === "professors"}
          onShow={() => onShowSearchInput("professors")}
          onSelect={(id) => {
            onSelect(id, "professor");
          }}
        />
        <button
          className="btn-danger"
          onClick={() => {
            handleClearFilters();
            setFilterActive(null);
          }}
        >
          Limpiar
        </button>
      </div>
    );
};

export default FilterGroupClass;
import { useEffect, useRef } from "react";
import SelectWithFetch from "../SelectWithFetch";
import SelectToChange from "../SelectToChange";
import useClickOutside from "@/hooks/useClickOutside";

interface Props {
  courseFilter: string;
  instrumentFilter: string;
  semesterFilter: string;
  filterActive: string;
  onShow: (entity: string) => void;
  onSelect: (id: string, entity: string) => void;
  handleClearFilters: () => void;
  setFilterActive: (entity: string | null) => void;
  debouncedQuery: string;
}

const FilterEnrolls = ({
  courseFilter,
  instrumentFilter,
  semesterFilter,
  filterActive,
  onShow,
  onSelect,
  handleClearFilters,
  setFilterActive,
  debouncedQuery,
}: Props) => {
  const selectsContainerRef = useRef<HTMLDivElement>(null);
  // Manejar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterActive(null); // Cerrar todos los selects
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setFilterActive]);

  // Manejar clics fuera de los selects
  useClickOutside(selectsContainerRef, () =>  setFilterActive(null));
  return (
    <div
      ref={selectsContainerRef}
      className="pt-6 flex flex-col lg:flex-wrap lg:gap-y-8 lg:flex-row gap-3 w-fit select-none mx-auto lg:mx-0"
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
      <button
        className="btn-danger"
        onClick={() => {
          handleClearFilters();
          setFilterActive(null);
        }}
      >
        Limpiar
      </button>
      {courseFilter || instrumentFilter || semesterFilter ? (
        <SelectToChange 
          isActive={filterActive === "change"}
          entity="enrolls"
          filters={`?course=${courseFilter}&instrument=${instrumentFilter}&semester=${semesterFilter}&query=${debouncedQuery}`}
          onShow={() => onShow("change")}
          
        />
      ) : null}
    </div>
  );
};

export default FilterEnrolls;

import SelectWithFetch from "../SelectWithFetch";

interface Props{
  courseFilter: string;
  instrumentFilter: string;
  semesterFilter: string;
  filterActive: string;
  onShow: (entity: string) => void;
  onSelect: (id: string, entity: string) => void;
  handleClearFilters: () => void;
}

const FilterEnrolls = ({ courseFilter, instrumentFilter, semesterFilter, filterActive, onShow, onSelect, handleClearFilters }: Props) => {
  return (
    <>
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
      <button className="btn-secondary" onClick={handleClearFilters}>
        Limpiar
      </button>
    </>
  );
};

export default FilterEnrolls;

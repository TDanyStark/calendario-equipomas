import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Primaryh1 from "../components/titles/Primaryh1";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useItemMutations from "@/hooks/useItemsMutation";
import { EnrollType, GroupClassType, ProfessorType, ScheduleStateType } from "@/types/Api";
import ActivePeriod from "@/components/ChangeAP/ActivePeriod";
import SearchSelect from "@/components/SearchSelect";
import { useMemo, useState } from "react";
import MiniTable from "@/components/MiniTable";

const entity = "groupclass";
// const entityName = "clases grupales";

const GroupClassCreate = () => {
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const [filterActive, setFilterActive] = useState<string | null>(null);
  const [tabActive, setTabActive] = useState<string>("students");
  const [idsStudents, setIdsStudents] = useState<string[]>([]);

  const daysOfWeek = useSelector(
    (state: { schedule: ScheduleStateType }) => state.schedule.scheduleDays
  );
  // Mutaciones
  const { createItem, isCreateLoading } = useItemMutations<GroupClassType>(
    entity,
    JWT
  );

  const handleSelectedIds = (ids: string[]) => {
    setIdsStudents(ids);
  };

  const columnsStudents = useMemo(
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
    ],
    []
  );

  const columnsProfessors = useMemo(
    () => [
      {
        label: "ID",
        renderCell: (item: unknown) => (item as ProfessorType).id,
      },
      {
        label: "Profesor",
        renderCell: (item: unknown) => (item as ProfessorType).name,
      },
      {
        label: "Instrumentos",
        renderCell: (item: unknown) => (item as ProfessorType).instruments,
      },
    ],
    []
  );

  return (
    <section className="section_page">
      <Primaryh1>
        Crear Clase Grupal: <ActivePeriod />
      </Primaryh1>
      <div className="mt-8 flex gap-8 flex-col lg:flex-row items-start">
        <div className="p-6 border rounded-lg w-1/4 max-w-96 flex flex-col gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre de la clase
            </label>
            <input
              id="name"
              className="px-3 py-2 border rounded w-full"
              type="text"
            />
          </div>
          <div>
            <span className="block text-sm font-medium mb-1">Salón</span>
            <SearchSelect
              entity="rooms"
              defaultValue=""
              onSelect={(id, name) => {}}
              isActive={filterActive === "rooms"}
              onFocus={() => {
                setFilterActive("rooms");
              }}
              onClose={() => {
                setFilterActive(null);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="day">
              Día
            </label>
            <select
              name="day"
              id="day"
              className="px-3 py-2 border rounded w-full"
            >
              <option value="">Escoge un día</option>
              {daysOfWeek?.map(
                (day: { id: string; dayDisplayName: string }) => (
                  <option key={day.id} value={day.id}>
                    {day.dayDisplayName}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex gap-4 items-center">
            <div>
              <label
                htmlFor="startTime"
                className="block  text-sm font-medium mb-1"
              >
                Hora de inicio
              </label>
              <input
                id="startTime"
                type="time"
                className="px-3 py-2 border rounded"
              />
            </div>
            <span className="mt-5"> - </span>
            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium mb-1"
              >
                Hora de fin
              </label>
              <input
                id="endTime"
                type="time"
                className="px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div>
            <button className="btn-primary w-full">Crear</button>
          </div>
        </div>
        <div className="p-6 border rounded-lg flex-1 overflow-hidden">
          <div className="flex gap-4 mb-4">
            <button
              className={`block text-xl py-1 px-3 rounded mb-1  ${
                tabActive === "students"
                  ? "font-medium bg-primary"
                  : "font-light border"
              }`}
              onClick={() => setTabActive("students")}
            >
              Estudiantes - {idsStudents.length}
            </button>
            <button
              className={`block text-xl py-1 px-3 rounded mb-1 ${
                tabActive === "professors"
                  ? "font-medium bg-primary"
                  : "font-light border"
              }`}
              onClick={() => setTabActive("professors")}
            >
              Profesores
            </button>
          </div>
          {tabActive === "students" && (
            <MiniTable
              entity="enrolls"
              entityName="estudiantes"
              JWT={JWT || ""}
              columns={columnsStudents}
              searchPlaceholder="Buscar estudiante..."
              gridTemplateColumns="50px 1fr 2fr 2fr 1fr 1fr"
              handleSelectedIds={handleSelectedIds}
            />
          )}
          {tabActive === "professors" && (
            <MiniTable
              entity="professors"
              entityName="profesores"
              JWT={JWT || ""}
              columns={columnsProfessors}
              searchPlaceholder="Buscar profesor..."
              gridTemplateColumns="50px 150px 1fr 1fr"
              handleSelectedIds={handleSelectedIds}
            />
          )}
        </div>
      </div>

      <ToastContainer theme="dark" limit={2} />
    </section>
  );
};

export default GroupClassCreate;

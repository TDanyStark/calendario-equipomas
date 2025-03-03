import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Primaryh1 from "../components/titles/Primaryh1";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useItemMutations from "@/hooks/useItemsMutation";
import {
  EnrollType,
  GroupClassType,
  ProfessorType,
} from "@/types/Api";
import ActivePeriod from "@/components/ChangeAP/ActivePeriod";
import SearchSelect from "@/components/SearchSelect";
import { useMemo, useState } from "react";
import MiniTable from "@/components/MiniTable";
import SelectDayAndHourCreate from "@/components/SelectDayAndHour/SelectDayAndHourCreate";

const entity = "groupclass";
// const entityName = "clases grupales";

const GroupClassCreate = () => {
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const [filterActive, setFilterActive] = useState<string | null>(null);

  const [roomId, setRoomId] = useState<string>("");

  const [tabActive, setTabActive] = useState<string>("students");
  const [idsStudents, setIdsStudents] = useState<string[]>([]);
  const [idsProfessors, setIdsProfessors] = useState<string[]>([]);
  // Mutaciones
  const { createItem, isCreateLoading } = useItemMutations<GroupClassType>(
    entity,
    JWT
  );

  

  const handleSelectedIds = (ids: string[], entity: string) => {
    if (entity === "enrolls") {
      setIdsStudents(ids);
    }
    if (entity === "professors") {
      setIdsProfessors(ids);
    }
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
        renderCell: (item: unknown) =>
          (item as ProfessorType).instruments
            .map((instrument) => instrument.name)
            .join(", "),
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
            <span className="block text-sm font-medium mb-1">
              Salón {roomId}
            </span>
            <SearchSelect
              entity="rooms"
              defaultValue=""
              onSelect={(id) => {
                setRoomId(id);
              }}
              isActive={filterActive === "rooms"}
              onFocus={() => {
                setFilterActive("rooms");
              }}
              onClose={() => {
                setFilterActive(null);
              }}
            />
          </div>
          {roomId && (
            <SelectDayAndHourCreate 
              roomId={roomId}  
              onChange={({ day, startTime, endTime }) => {
                // Aquí manejas los valores seleccionados
                console.log("Día:", day);
                console.log("Inicio:", startTime);
                console.log("Fin:", endTime);
              }} 
            />
          )}
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
              Estudiantes{" "}
              {idsStudents.length === 0 ? "" : `(${idsStudents.length})`}
            </button>
            <button
              className={`block text-xl py-1 px-3 rounded mb-1 ${
                tabActive === "professors"
                  ? "font-medium bg-primary"
                  : "font-light border"
              }`}
              onClick={() => setTabActive("professors")}
            >
              Profesores{" "}
              {idsProfessors.length === 0 ? "" : `(${idsProfessors.length})`}
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
    </section>
  );
};

export default GroupClassCreate;

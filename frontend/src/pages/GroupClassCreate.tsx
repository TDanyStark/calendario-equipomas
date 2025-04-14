import "react-toastify/dist/ReactToastify.css";
import Primaryh1 from "../components/titles/Primaryh1";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useItemMutations from "@/hooks/useItemsMutation";
import { EnrollType, GroupClassType, ProfessorType } from "@/types/Api";
import ActivePeriod from "@/components/ChangeAP/ActivePeriod";
import SearchSelect from "@/components/SearchSelect";
import { useMemo, useState } from "react";
import MiniTable from "@/components/MiniTable";
import SelectDayAndHourCreate from "@/components/SelectDayAndHour/SelectDayAndHourCreate";
import { useCallback } from "react";
import TableGroupClassProfessor from "@/components/professors/TableGroupClassProfessor";
import { toast } from "react-toastify";

const entity = "groupclass";
// const entityName = "clases grupales";

const GroupClassCreate = () => {
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const [filterActive, setFilterActive] = useState<string | null>(null);

  const [name, setName] = useState<string>("");

  const [roomId, setRoomId] = useState<number  | null>(null);
  const [dayId, setDayId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const [tabActive, setTabActive] = useState<string>("students");
  const [idsEnrolls, setidsEnrolls] = useState<string[]>([]);
  const [idsProfessors, setIdsProfessors] = useState<string[]>([]);
  // Mutaciones
  const { createItem, isCreateLoading } = useItemMutations<GroupClassType>(
    entity,
    JWT
  );

  const handleSelectedIds = (ids: string[], entity: string) => {
    switch (entity) {
      case "enrolls":
        setidsEnrolls(ids);
        break;
      case "professors/only/assign":
        setIdsProfessors(ids);
        break;
      default:
        break;
    }
  };

  const handleCreate = () => {
    if (name === "" || roomId === null || dayId === null || startTime === null || endTime === null) {
      toast.error("Debes de completar todos los campos.");
      return;
    }
    if (idsEnrolls.length === 0 || idsProfessors.length === 0) {
      toast.error("Debes seleccionar al menos un profesor y un estudiante.");
      return;
    }
    const data = {
      id: "",
      name,
      roomId,
      dayId,
      startTime,
      endTime,
      enrollments: idsEnrolls,
      professors: idsProfessors,
    };
    console.log("data", data);
    // crear mutacion
    createItem.mutate(data);
  };
  // };

  const onSelectHour = useCallback(
    ({
      day,
      startTime,
      endTime,
    }: {
      day: number | null;
      startTime: string | null;
      endTime: string | null;
    }) => {
      setDayId(day);
      setStartTime(startTime);
      setEndTime(endTime);
    },
    []
  );

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
            ?.map((instrument) => instrument.name)
            .join(", ") ?? "",
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
        <div className="p-6 border rounded-lg w-1/4 min-w-80 max-w-96 flex flex-col gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre de la clase
            </label>
            <input
              id="name"
              className="px-3 py-2 border rounded w-full"
              type="text"
              placeholder="Nombre de la clase"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
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
                setRoomId(Number(id));
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
            <SelectDayAndHourCreate roomId={roomId} onChange={onSelectHour} />
          )}
          <div>
            <button className="btn-primary w-full" onClick={handleCreate}>
              Crear
            </button>
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
              Matriculas{" "}
              {idsEnrolls.length === 0 ? "" : `(${idsEnrolls.length})`}
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
              entityName="matriculas"
              JWT={JWT || ""}
              columns={columnsStudents}
              searchPlaceholder="Buscar matricula..."
              gridTemplateColumns="50px 1fr 2fr 2fr 1fr 1fr"
              handleSelectedIds={handleSelectedIds}
              idsSelected={idsEnrolls}
            />
          )}
          {tabActive === "professors" && (
            <TableGroupClassProfessor
              entity="professors/only/assign"
              entityName="profesores"
              JWT={JWT || ""}
              columns={columnsProfessors}
              searchPlaceholder="Buscar profesor..."
              gridTemplateColumns="50px 150px 1fr 1fr"
              handleSelectedIds={handleSelectedIds}
              idsSelected={idsProfessors}
            />
          )}
          {/* <div className={`${tabActive === "students" ? "" : "hidden"}`}>
          <MiniTable
              entity="enrolls"
              entityName="matriculas"
              JWT={JWT || ""}
              columns={columnsStudents}
              searchPlaceholder="Buscar matricula..."
              gridTemplateColumns="50px 1fr 2fr 2fr 1fr 1fr"
              handleSelectedIds={handleSelectedIds}
            />
          </div>
          <div className={`${tabActive === "professors" ? "" : "hidden"}`}>
            <MiniTable
              entity="professors/only/assign"
              entityName="profesores"
              JWT={JWT || ""}
              columns={columnsProfessors}
              searchPlaceholder="Buscar profesor..."
              gridTemplateColumns="50px 150px 1fr 1fr"
              handleSelectedIds={handleSelectedIds}
            />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default GroupClassCreate;

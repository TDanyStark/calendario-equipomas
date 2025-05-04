import { useEffect, useState, useMemo, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import Primaryh1 from "../components/titles/Primaryh1";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { EnrollType, GroupClassType, ProfessorType } from "@/types/Api";
import axios from "axios";
import { URL_BACKEND } from "@/variables";
import { Loader } from "@/components/Loader/Loader";
import ActivePeriod from "@/components/ChangeAP/ActivePeriod";
import SearchSelect from "@/components/SearchSelect";
import MiniTable from "@/components/MiniTable";
import SelectDayAndHourCreate from "@/components/SelectDayAndHour/SelectDayAndHourCreate";
import TableGroupClassProfessor from "@/components/professors/TableGroupClassProfessor";
import useItemMutations from "@/hooks/useItemsMutation";
import { toast } from "react-toastify";
import { Spinner } from "@/components/Loader/Spinner";

const entity = "groupclass";

const GroupClassEdit = () => {
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groupClass, setGroupClass] = useState<GroupClassType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [filterActive, setFilterActive] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [roomId, setRoomId] = useState<number | null>(null);
  const [dayId, setDayId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [tabActive, setTabActive] = useState<string>("students");
  const [idsEnrolls, setIdsEnrolls] = useState<string[]>([]);
  const [idsProfessors, setIdsProfessors] = useState<string[]>([]);

  // Mutations
  const { updateItem, isUpdateLoading } = useItemMutations<GroupClassType>(
    entity,
    JWT
  );

  useEffect(() => {
    const fetchGroupClass = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${URL_BACKEND}groupclass/${id}`, {
          headers: { Authorization: `Bearer ${JWT}` },
        });
        const data = response.data.data;
        setGroupClass(data);
        
        // Inicializar estados del formulario con los datos existentes
        setName(data.name);
        setRoomId(data.roomId);
        setDayId(data.day_id);
        setStartTime(data.startTime);
        setEndTime(data.endTime);
        setIdsEnrolls(data.enrollments || []);
        setIdsProfessors(data.professors || []);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group class:", error);
        setError("No se pudo cargar la información de la clase grupal");
        setLoading(false);
      }
    };

    fetchGroupClass();
  }, [id, JWT]);

  const handleSelectedIds = (ids: string[], entity: string) => {
    switch (entity) {
      case "enrolls":
        setIdsEnrolls(ids);
        break;
      case "professors/only/assign":
        setIdsProfessors(ids);
        break;
      default:
        break;
    }
  };

  const handleUpdate = () => {
    if (name === "" || roomId === null || dayId === null || startTime === null || endTime === null) {
      toast.error("Debes de completar todos los campos.");
      return;
    }
    if (idsEnrolls.length === 0 || idsProfessors.length === 0) {
      toast.error("Debes seleccionar al menos un profesor y un estudiante.");
      return;
    }
    const data = {
      id: String(id) || "0",
      name,
      roomId: typeof roomId === "string" ? parseInt(roomId, 10) : roomId,
      dayId,
      startTime,
      endTime,
      enrollments: idsEnrolls,
      professors: idsProfessors,
    };
    
    updateItem.mutate(data, {
      onSuccess: () => {
        toast.success("Clase grupal actualizada correctamente");
        navigate("/group-class");
      },
    });
  };

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
        renderCell: (item: unknown) => (item as EnrollType).id || "",
      },
      {
        label: "Estudiante",
        renderCell: (item: unknown) => (item as EnrollType).studentName || "",
      },
      {
        label: "Curso",
        renderCell: (item: unknown) => (item as EnrollType).courseName || "",
      },
      {
        label: "Semestre",
        renderCell: (item: unknown) => (item as EnrollType).semesterName || "",
      },
      {
        label: "Instrumento",
        renderCell: (item: unknown) => (item as EnrollType).instrumentName || "",
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

  // Validar si el ID es un número
  if (id && !/^\d+$/.test(id)) {
    return <Navigate to="/404" />; // Redirige a una página de error si el ID no es numérico
  }

  if (loading) {
    return <Loader />;
  }

  if (error || !groupClass) {
    return (
      <section className="section_page">
        <Primaryh1>Error</Primaryh1>
        <div className="text-red-500">
          {error || "No se encontró la clase grupal"}
        </div>
        <button
          onClick={() => navigate("/group-class")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          Volver a clases grupales
        </button>
      </section>
    );
  }

  return (
    <section className="section_page">
      <Primaryh1>
        Editar Clase Grupal: <ActivePeriod />
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
              Salón
            </span>
            <SearchSelect
              entity="rooms"
              defaultValue={groupClass.roomName || ""}
              onSelect={(id: number | null) => {
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
          {roomId !== null && (
            <SelectDayAndHourCreate 
              roomId={roomId} 
              onChange={onSelectHour} 
              defaultDay={dayId} 
              defaultStartTime={startTime} 
              defaultEndTime={endTime} 
            />
          )}
          <div>
            <button className="btn-primary w-full" onClick={handleUpdate}>
              {
                isUpdateLoading ? (
                  <div className="flex items-center justify-center">
                    <Spinner size={1.2} />
                    <span className="ml-2">Actualizando...</span>
                  </div>
                ) : (
                  "Actualizar"
                )
              }
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
        </div>
      </div>
    </section>
  );
};

export default GroupClassEdit;

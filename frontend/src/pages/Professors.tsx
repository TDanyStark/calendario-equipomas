import { useForm } from "react-hook-form";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  InstrumentType,
  ProfessorType,
  RoomType,
  SelectableInstrument,
  SelectableRoom,
} from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";
import useFetchItems from "../hooks/useFetchItems";
import Primaryh1 from "../components/titles/Primaryh1";
import CloseModalBtn from "../components/buttons/CloseModalBtn";
import BackgroundDiv from "../components/modal/BackgroundDiv";
import CancelModalBtn from "../components/buttons/CancelModalBtn";
import SubmitModalBtn from "../components/buttons/SubmitModalBtn";
import { ScheduleType } from "../types/Api";
import SelectShedulePro from "../components/SelectShedulePro";
import SelectMultiple from "../components/SelectMultiple";
import fetchItemByID from "../utils/fetchItemByID";
import DataTablePagination from "../components/TablePagination";
import Skeleton from "@/components/Loader/Skeleton";

const entity = "professors";
const entityName = "profesores";

const Professors = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editProfessor, setEditProfessor] = useState<ProfessorType | null>(
    null
  );
  const [schedule, setSchedule] = useState<ScheduleType[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const { data: instruments, isLoading: isLoadingInstruments } = useFetchItems(
    "instruments",
    JWT
  );
  const { data: rooms, isLoading: isLoadingRooms } = useFetchItems(
    "rooms",
    JWT
  );

  const [instrumentProfessor, setInstrumentProfessor] = useState<
    SelectableInstrument[]
  >([]);
  const [roomsProfessor, setRoomsProfessor] = useState<SelectableRoom[]>([]);

  const fillDefaultValues = useCallback(() => {
    const instrumentsData = instruments as InstrumentType[];
    const roomsData = rooms as RoomType[];

    const instrumentsProfessor = instrumentsData.map((instrument) => {
      return {
        ...instrument,
        selected: false,
      };
    });

    const roomsProfessor = roomsData.map((room) => {
      return {
        ...room,
        selected: false,
      };
    });

    setInstrumentProfessor(instrumentsProfessor);
    setRoomsProfessor(roomsProfessor);
  }, [instruments, rooms]);

  useEffect(() => {
    if (!isLoadingInstruments && !isLoadingRooms) {
      fillDefaultValues();
    }
  }, [fillDefaultValues, isLoadingInstruments, isLoadingRooms]);

  const { register, handleSubmit, watch, setValue, reset } =
    useForm<ProfessorType>();
  // Observamos el valor del checkbox
  const hasContract = watch("hasContract");

  const onSubmit = (data: ProfessorType) => {
    const instrumentProfessorSelecteds = instrumentProfessor.filter(
      (instrument) => instrument.selected
    );
    const roomsProfessorSelecteds = roomsProfessor.filter(
      (room) => room.selected
    );

    // validar que se seleccionen al menos un instrumento y un salon
    if (instrumentProfessorSelecteds.length === 0) {
      toast.error("Debe seleccionar al menos un instrumento");
      return;
    }

    if (roomsProfessorSelecteds.length === 0) {
      toast.error("Debe seleccionar al menos un salón");
      return;
    }

    // validar que existe aunque sea un dia activo en el horario
    const hasActiveDay = schedule.some((day) => day.isActive);
    if (!hasActiveDay) {
      toast.error("Debe seleccionar al menos un día activo en el horario");
      return;
    }

    const cleanedData = {
      ...data,
      availability: { ...schedule },
      instruments: instrumentProfessorSelecteds,
      rooms: roomsProfessorSelecteds,
      timeContract: hasContract ? String(data.timeContract) : "0",
    };

    if (editProfessor) {
      updateItem.mutate(cleanedData);
    } else {
      createItem.mutate(cleanedData);
    }
  };

  // Mutaciones
  const {
    createItem,
    isCreateLoading,
    updateItem,
    isUpdateLoading,
    deleteItem,
    deleteItems,
  } = useItemMutations<ProfessorType>(entity, JWT, setIsOpen);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleCreate = useCallback(() => {
    setEditProfessor(null);
    setIsOpen(true);
    fillDefaultValues();
    reset();
  }, [fillDefaultValues, reset]);

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleEdit = useCallback(
    async (item: ProfessorType) => {
      setIsLoadingDetails(true); // Activar el estado de carga
      setIsOpen(true); // Abrir el modal

      try {
        // Obtener los detalles completos del profesor usando fetchItemByID
        const professorDetails = await fetchItemByID<ProfessorType>(
          entity,
          item.id,
          JWT
        );

        if (professorDetails.data) {
          const professor = professorDetails.data; // Tomar el primer elemento del array

          // Establecer los valores del formulario
          setValue("firstName", professor.firstName);
          setValue("lastName", professor.lastName);
          setValue("id", professor.id);
          setValue("phone", professor.phone);
          setValue("status", professor.status);
          setValue("hasContract", professor.hasContract === 1 ? true : false);
          setValue("timeContract", professor.timeContract === "0" ? "" : professor.timeContract);
          setValue("user.email", professor.user.email);

          // Actualizar los instrumentos seleccionados
          const updatedInstruments = instrumentProfessor.map((instrument) => ({
            ...instrument,
            selected: professor.instruments.some(
              (profInstrument) => profInstrument.id === instrument.id
            ),
          }));
          setInstrumentProfessor(updatedInstruments);

          // Actualizar los salones seleccionados
          const updatedRooms = roomsProfessor.map((room) => ({
            ...room,
            selected: professor.rooms.some(
              (profRoom) => profRoom.id === room.id
            ),
          }));
          setRoomsProfessor(updatedRooms);

          // Establecer el profesor en edición
          setEditProfessor(professor);
        } else {
          toast.error("No se encontraron detalles del profesor.");
          setIsOpen(false); // Cerrar el modal
        }
      } catch (error) {
        toast.error("Error al cargar los detalles del profesor.");
        setIsOpen(false); // Cerrar el modal
        console.error(error);
      } finally {
        setIsLoadingDetails(false); // Desactivar el estado de carga
      }
    },
    [JWT, instrumentProfessor, roomsProfessor, setValue]
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleDelete = useCallback(
    (item: ProfessorType) => {
      deleteItem.mutate(item.id);
    },
    // eslint-disable-next-line
    []
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const handleDeleteSelected = useCallback(
    (selectedIds: React.Key[]) => {
      const stringIds = selectedIds.map((id) => id.toString());
      deleteItems.mutate(stringIds);
    },
    // eslint-disable-next-line
    []
  );

  // @ts-expect-error: no se porque no me reconoce que la estoy usando abajo
  const columns = useMemo(
    () => [
      {
        label: "ID",
        sortKey: "id",
        renderCell: (item: unknown) => (item as ProfessorType).id,
      },
      {
        label: "Nombre",
        sortKey: "firstName",
        renderCell: (item: unknown) => (item as ProfessorType).firstName,
      },
      {
        label: "Apellido",
        sortKey: "lastName",
        renderCell: (item: unknown) => (item as ProfessorType).lastName,
      },
      {
        label: "Teléfono",
        sortKey: "phone",
        renderCell: (item: unknown) =>
          (item as ProfessorType).phone || "No disponible",
      },
      {
        label: "Estado",
        sortKey: "status",
        renderCell: (item: unknown) => (item as ProfessorType).status,
      },
    ],
    []
  );

  return (
    <section className="section_page">
      <Primaryh1>Profesores</Primaryh1>
      <DataTablePagination<ProfessorType>
        entity={entity}
        entityName={entityName}
        JWT={JWT}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteSelected={handleDeleteSelected}
        searchPlaceholder="Buscar profesor"
        TextButtonCreate="profesor"
        gridTemplateColumns="50px 180px 1fr 1fr 1fr 180px 150px"
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
                  {editProfessor ? "Editar Profesor" : "Crear Profesor"}
                </DialogTitle>
                <CloseModalBtn onClick={() => setIsOpen(false)} />
              </div>

              {isLoadingDetails ? (
                <Skeleton className="w-full h-[1000px]" />
              ) : (
                <>
                  <form
                    id={`form-${entity}`}
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4"
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="id"
                        className="block text-sm font-medium mb-1"
                      >
                        Cédula
                      </label>
                      <input
                        id="id"
                        {...register("id", { required: true })}
                        className={`w-full ${
                          editProfessor ? "input-disabled" : "input-primary"
                        }`}
                        type="text"
                        disabled={editProfessor ? true : false}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium mb-1"
                      >
                        Nombre
                      </label>
                      <input
                        autoFocus 
                        id="firstName"
                        {...register("firstName", { required: true })}
                        className="input-primary w-full"
                        type="text"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium mb-1"
                      >
                        Apellido
                      </label>
                      <input
                        id="lastName"
                        {...register("lastName", { required: true })}
                        className="input-primary w-full"
                        type="text"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-1"
                      >
                        Teléfono
                      </label>
                      <input
                        id="phone"
                        {...register("phone")}
                        className="input-primary w-full"
                        type="text"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium mb-1"
                      >
                        Estado
                      </label>
                      <select
                        id="status"
                        {...register("status", { required: true })}
                        className="input-primary w-full"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                      >
                        Correo Electrónico
                      </label>
                      <input
                        id="email"
                        {...register("user.email", { required: true })}
                        className="input-primary w-full"
                        type="email"
                      />
                    </div>
                    <div className="mb-4">
                      <label>
                        <input type="checkbox" {...register("hasContract")} />
                        <span className="ml-2 text-sm font-medium">
                          Con contrato
                        </span>
                      </label>
                    </div>
                    {hasContract === true && (
                      <div className="mb-4">
                        <label
                          htmlFor="timeContract"
                          className="block text-sm font-medium mb-1"
                        >
                          Tiempo de contrato (Horas)
                        </label>
                        <input
                          id="timeContract"
                          {...register("timeContract", { required: true })}
                          className="input-primary w-full"
                          type="number"
                        />
                      </div>
                    )}
                  </form>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <SelectMultiple<SelectableInstrument>
                        items={instrumentProfessor}
                        propName="name"
                        setItems={setInstrumentProfessor}
                        title="Instrumentos"
                      />
                    </div>
                    <div className="flex-1">
                      <SelectMultiple<SelectableRoom>
                        items={roomsProfessor}
                        propName="name"
                        setItems={setRoomsProfessor}
                        title="Salones"
                      />
                    </div>
                  </div>
                  <SelectShedulePro<ProfessorType>
                    schedule={schedule}
                    setSchedule={setSchedule}
                    canBeAdded={true}
                    editProfessor={editProfessor}
                  />
                </>
              )}
              <div className="modal_footer">
                <CancelModalBtn onClick={() => setIsOpen(false)} />
                <SubmitModalBtn
                  text={editProfessor ? "Actualizar" : "Crear"}
                  form={`form-${entity}`}
                  isLoading={isCreateLoading || isUpdateLoading}
                />
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}

      <ToastContainer theme="dark" limit={2} />
    </section>
  );
};

export default Professors;

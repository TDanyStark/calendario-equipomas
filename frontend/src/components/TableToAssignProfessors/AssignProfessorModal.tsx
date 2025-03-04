import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import CloseModalBtn from "../buttons/CloseModalBtn";
import CancelModalBtn from "../buttons/CancelModalBtn";
import SubmitModalBtn from "../buttons/SubmitModalBtn";
import BackgroundDiv from "../modal/BackgroundDiv";
import {
  ProfessorAssignType,
  ProfessorType,
  ScheduleType,
  SelectableInstrument,
  SelectableRoom,
} from "@/types/Api";
import { useEffect, useRef, useState } from "react";
import SelectMultiple from "../SelectMultiple";
import SelectShedulePro from "../SelectShedulePro";
import useFetchItems from "@/hooks/useFetchItems";
import { toast } from "react-toastify";

// Componente de Modal/Popup con Headless UI
interface AssignProfessorModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  professor:  ProfessorType & ProfessorAssignType | null;
  onAssign: (
    contract: boolean,
    hours: number,
    instrumentsProfessor: SelectableInstrument[],
    roomsProfessor: SelectableRoom[],
    schedule: ScheduleType[]
  ) => void;
  JWT: string | null;
  isLoading: boolean;
}

const AssignProfessorModal: React.FC<AssignProfessorModalProps> = ({
  isOpen,
  setIsOpen,
  professor,
  onAssign,
  JWT,
  isLoading,
}) => {
  const [contract, setContract] = useState(false);
  const [hours, setHours] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [instrumentProfessor, setInstrumentProfessor] = useState<
    SelectableInstrument[]
  >([]);
  const [roomsProfessor, setRoomsProfessor] = useState<SelectableRoom[]>([]);
  const [schedule, setSchedule] = useState<ScheduleType[]>([]);

  const { data: instruments, isLoading: isLoadingInstruments } = useFetchItems(
    "instruments",
    JWT
  );
  const { data: rooms, isLoading: isLoadingRooms } = useFetchItems(
    "rooms",
    JWT
  );

  useEffect(() => {
    if (instruments && !isLoadingInstruments) {
      const updatedInstruments = instruments.map((instrument: SelectableInstrument) => ({
        ...instrument,
        selected: professor 
          ? professor.instruments.some(
              (profInstrument) => String(profInstrument.InstrumentID) === String(instrument.id)
            )
          : false
      }));
      setInstrumentProfessor(updatedInstruments);
    }
  }, [instruments, isLoadingInstruments, isOpen, professor]);

  // Prepare rooms with selection based on professor's data
  useEffect(() => {
    if (rooms && !isLoadingRooms) {
      const updatedRooms = rooms.map((room: SelectableRoom) => ({
        ...room,
        selected: professor
          ? professor.rooms.some(
              (profRoom) => String(profRoom.RoomID) === String(room.id)
            )
          : false
      }));
      setRoomsProfessor(updatedRooms);
    }
  }, [isLoadingRooms, rooms, isOpen, professor]);

  useEffect(() => {
    if (professor) {
      setContract(professor.contract);
      setHours(professor.hours);
    } else {
      setContract(false);
      setHours(1);
    }

    if (!isOpen){
      setContract(false);
      setHours(1);
      setInstrumentProfessor([]);
      setRoomsProfessor([]);
      setSchedule([]);
    }
  }, [isOpen, professor]);


  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 50);
  }, [contract, inputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // si no hay instrumentos o salones seleccionados, no se puede asignar lanzar un toast
    if (
      instrumentProfessor.filter((instrument) => instrument.selected).length ===
        0 ||
      roomsProfessor.filter((room) => room.selected).length === 0 ||
      schedule.filter((schedule) => schedule.isActive).length === 0
    ) {
      toast.error(
        "Debe seleccionar al menos un instrumento, un salón y un dia como mínimo"
      );
      return;
    }
    onAssign(contract, hours, instrumentProfessor, roomsProfessor, schedule);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <BackgroundDiv />
      <div className="modal_container">
        <DialogPanel className="dialog_panel">
          <div className="modal_header">
            <DialogTitle className="dialog_title">Asignar profesor</DialogTitle>
            <CloseModalBtn onClick={() => setIsOpen(false)} />
          </div>

          <div>
            {professor && (
              <p className="mb-4 text-lg">
                {professor.firstName} {professor.lastName}
              </p>
            )}

            <form
              id="form-assign-professor"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="contract"
                  checked={contract}
                  onChange={(e) => setContract(e.target.checked)}
                  className="mr-2 h-5 w-5"
                />
                <label htmlFor="contract" className="text-lg">
                  Contrato
                </label>
              </div>

              <Transition
                show={contract}
                enter="transition-all duration-300 ease-out"
                enterFrom="opacity-0 max-h-0 overflow-hidden"
                enterTo="opacity-100 max-h-24 overflow-visible"
                leave="transition-all duration-200 ease-in"
                leaveFrom="opacity-100 max-h-24 overflow-visible"
                leaveTo="opacity-0 max-h-0 overflow-hidden"
              >
                <div className="mt-4">
                  <label
                    htmlFor="hours"
                    className="block text-sm font-medium mb-1"
                  >
                    Horas:
                  </label>
                  <input
                    type="number"
                    id="hours"
                    value={hours}
                    min={1}
                    ref={inputRef}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="input-primary w-full"
                  />
                </div>
              </Transition>
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
                editItem={professor}
              />
            </form>
          </div>

          <div className="modal_footer">
            <CancelModalBtn onClick={() => setIsOpen(false)} />
            <SubmitModalBtn text="Asignar" form="form-assign-professor" isLoading={isLoading} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AssignProfessorModal;

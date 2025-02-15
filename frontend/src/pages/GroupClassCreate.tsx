import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Primaryh1 from "../components/titles/Primaryh1";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useItemMutations from "@/hooks/useItemsMutation";
import { GroupClassType, ScheduleStateType } from "@/types/Api";
import ActivePeriod from "@/components/ChangeAP/ActivePeriod";
import SearchSelect from "@/components/SearchSelect";
import { useState } from "react";

const entity = "groupclass";
// const entityName = "clases grupales";

const GroupClassCreate = () => {
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const [filterActive, setFilterActive] = useState<string | null>(null);

  const daysOfWeek = useSelector(
      (state: { schedule: ScheduleStateType }) => state.schedule.scheduleDays
  );
  // Mutaciones
  const { createItem, isCreateLoading } = useItemMutations<GroupClassType>(
    entity,
    JWT
  );
  return (
    <section className="section_page">
      <Primaryh1>
        Crear Clase Grupal: <ActivePeriod />
      </Primaryh1>
      <div className="mt-8 flex gap-8 flex-col lg:flex-row">
        <div className="p-6 border rounded-lg flex-1 flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre de la clase
            </label>
            <input
              id="name"
              className="px-3 py-2 border rounded"
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
            <span className="block text-sm font-medium mb-1">Día</span>
            <select 
            name="day" 
            id="day"
            className="px-3 py-2 border rounded"
            >
              <option value="">Escoge un día</option>
              {daysOfWeek?.map((day:{id:string, dayDisplayName:string}) => (
                <option key={day.id} value={day.id}>
                  {day.dayDisplayName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-4 border rounded-lg flex-1">

        </div>
      </div>

      <ToastContainer theme="dark" limit={2} />
    </section>
  );
};

export default GroupClassCreate;

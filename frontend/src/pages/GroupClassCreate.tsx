import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Primaryh1 from "../components/titles/Primaryh1";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useItemMutations from "@/hooks/useItemsMutation";
import { GroupClassType } from "@/types/Api";
import ActivePeriod from "@/components/ChangeAP/ActivePeriod";

const entity = "groupclass";
// const entityName = "clases grupales";

const GroupClassCreate = () => {
  const JWT = useSelector((state: RootState) => state.auth.JWT);

    // Mutaciones
    const { createItem, isCreateLoading} =
    useItemMutations<GroupClassType>(entity, JWT);
  return (
    <section className="section_page">
      <Primaryh1>Crear Clase Grupal: <ActivePeriod/></Primaryh1>
      <div>

      </div>

      <ToastContainer theme="dark" limit={2} />
    </section>
  );
};

export default GroupClassCreate;

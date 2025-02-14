import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Primaryh1 from "../components/titles/Primaryh1";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Navigate, useParams } from "react-router-dom";

const entity = "groupclass";
// const entityName = "clases grupales";

const GroupClassEdit = () => {
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const { id } = useParams();

    // Validar si el ID es un número
    if (!/^\d+$/.test(id)) {
      return <Navigate to="/404" />; // Redirige a una página de error si el ID no es numérico
    }


  return (
    <section className="section_page">
      <Primaryh1>Editar Clase Grupal: {id}</Primaryh1>


      <ToastContainer theme="dark" limit={2} />
    </section>
  );
};

export default GroupClassEdit;

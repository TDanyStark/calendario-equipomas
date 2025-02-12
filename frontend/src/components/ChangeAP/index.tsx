import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowSvg from "@/icons/ArrowSvg";
import { AcademicPeriodType } from "@/types/Api";
import { RootState } from "@/store/store";
import selectAC from "@/utils/selectAP";
import useFetchForSelect from "@/hooks/useFetchForSelect";
import useClickOutside from "@/hooks/useClickOutside";

const entity = "academic-periods";

const ChangeAP = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useFetchForSelect(
    entity,
    JWT,
    true,
    undefined
  );
  const selectedAP: AcademicPeriodType = data?.find(
    (item: AcademicPeriodType) => item.selected === 1
  );

  useClickOutside(containerRef, () => setIsActive(false));

  const handleClicked = async (id: number) => {
    if (JWT) {
      setIsSaving(true);
      try {
        await selectAC(Number(id), JWT);
        queryClient.invalidateQueries(entity);
        queryClient.invalidateQueries("enrolls");
        toast.success("Período académico actualizado con éxito!");
      } catch (error) {
        toast.error("Error al actualizar el período académico");
        console.error(error);
      } finally {
        setIsSaving(false);
        setIsActive(false);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-64">
      <div
        className="px-3 py-2 border rounded flex justify-between items-center gap-2 overflow-hidden cursor-pointer"
        onClick={() => setIsActive(!isActive)}
      >
        <span className="font-light">Semestre activo: </span>
        <span className="font-bold">
          {selectedAP ? `${selectedAP.year} - ${selectedAP.semester}` : "..."}
        </span>
        <span className="bg-principal-bg">
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ArrowSvg />
          )}
        </span>
      </div>
      {isActive && (
        <ul className="rounded-b p-2 bg-gray-900 shadow-md max-h-56 overflow-auto w-full absolute z-10">
          {isLoading && <p className="text-center">Cargando...</p>}
          {isError && (
            <p className="text-center text-red-500">
              Error al cargar Periodos Académicos
            </p>
          )}
          {data &&
            data.map((item: AcademicPeriodType) => {
              if (item.selected === 1) return null;
              return (
                <li
                  key={item.id}
                  className={`px-2 py-1 hover:bg-gray-800 cursor-pointer flex justify-between items-center ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={
                    !isSaving ? () => handleClicked(Number(item.id)) : undefined
                  }
                >
                  {item.year} - {item.semester}
                  {isSaving &&
                    item.id ===
                      data?.find(
                        (item: AcademicPeriodType) => item.selected === 1
                      )?.id && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default ChangeAP;

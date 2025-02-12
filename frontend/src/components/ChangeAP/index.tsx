import ArrowSvg from "@/icons/ArrowSvg";
import { useState } from "react";
import useFetchItems from "@/hooks/useFetchItems";
import { AcademicPeriodType } from "@/types/Api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import selectAC from "@/utils/selectAP";

const entity = "academic-periods";

const ChangeAP = () => {
  const [isActive, setIsActive] = useState(false);

  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const academicPeriod = useSelector((state: RootState) => state.schedule.academicPeriod);
  
  const { data, isLoading, isError } = useFetchItems(entity, JWT, true, undefined); 

  const dataFiltered = data?.filter((item: AcademicPeriodType) => item.id !== academicPeriod?.id);

  const handleClicked = async (id: string) => {
    if (academicPeriod && JWT) {
      const response = await selectAC(academicPeriod.id, id, JWT);
      console.log(response);
    }
    
  };

  return (
    <div className="relative w-64">
      <div
        className="px-3 py-2 border rounded flex justify-between items-center gap-2 overflow-hidden cursor-pointer"
        onClick={() => setIsActive(!isActive)}
      >
        <span>{academicPeriod?.year} - {academicPeriod?.semester}</span>
        <span className="bg-principal-bg">
          <ArrowSvg />
        </span>
      </div>
      {isActive && (
        <ul className="rounded-b p-2 bg-gray-900 shadow-md max-h-56 overflow-auto w-full absolute z-10">
          {isLoading && <p>Cargando...</p>}
          {isError && <p>Error al cargar Periodos Academicos</p>}
          {dataFiltered &&
            dataFiltered.map((item: AcademicPeriodType) => (
              <li
                key={item.id}
                className="px-2 py-1 hover:bg-gray-800 cursor-pointer"
                onClick={() => handleClicked(item.id)}
              >
                {item.year} - {item.semester}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default ChangeAP;

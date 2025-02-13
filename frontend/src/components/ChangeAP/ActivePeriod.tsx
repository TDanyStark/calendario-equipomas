import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const ActivePeriod = () => {

  const currentPeriod = useSelector((state: RootState) => state.academicPeriod.period);
  return (
    <div>
      {currentPeriod && <p className="font-light">{currentPeriod.year} - {currentPeriod.semester}</p>}
    </div>
  );
};

export default ActivePeriod;
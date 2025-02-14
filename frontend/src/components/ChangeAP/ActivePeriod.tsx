import useFetchOneResource from "@/hooks/useFetchOneResource";
import { setPeriod } from "@/store/academicPeriodSlice";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SkeletonText from "../Loader/SkeletonText";

const ActivePeriod = () => {
  const dispatch = useDispatch();
  const currentPeriod = useSelector(
    (state: RootState) => state.academicPeriod.period
  );
  const nameCurrentPeriod =
    currentPeriod !== null
      ? `${currentPeriod.year} - ${currentPeriod.semester}`
      : null;
  // get react query /academic-periods/current
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const { data, isLoading, isError } = useFetchOneResource(
    "academic-periods/current",
    JWT,
    currentPeriod === null
  );

  useEffect(() => {
    if (data) {
      // dispatch
      dispatch(
        setPeriod({
          year: data.year,
          semester: data.semester,
        })
      )
    }
  }, [data, dispatch]);

  return (
    <>
      {isLoading && <SkeletonText text="2025 - 2" />}
      {isError && <span className="font-light">Error</span>}
      {(currentPeriod || data) && (
        <span className="font-light">
          {nameCurrentPeriod
            ? nameCurrentPeriod
            : `${data.year} - ${data.semester}`}
        </span>
      )}
    </>
  );
};

export default ActivePeriod;

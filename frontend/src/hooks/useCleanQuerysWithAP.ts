import { useQueryClient } from "react-query";

const useCleanQuerysWithAP = () => {
  const queryClient = useQueryClient();

  const cleanQuery =  () => {
    queryClient.invalidateQueries("academic-periods");
    queryClient.invalidateQueries("enrolls");
    queryClient.invalidateQueries("professors/assign");
  };

  return cleanQuery;
}

export default useCleanQuerysWithAP;
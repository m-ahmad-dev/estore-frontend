import { useQuery } from "@tanstack/react-query";
import { getRootCategories } from "../services/categoryApi";

const useRootCategories = () => {
  return useQuery({
    queryKey: ["categories", "roots"],
    queryFn: getRootCategories,
  });
};

export default useRootCategories;

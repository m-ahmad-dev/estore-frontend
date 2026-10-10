import { useQuery } from "@tanstack/react-query";

import { getCategoryDetails } from "../services/categoryApi";

const useCategoryDetails = (slug, options = {}) => {
  return useQuery({
    queryKey: ["categories", "details", slug],
    queryFn: () => getCategoryDetails(slug),
    enabled: Boolean(slug) && options.enabled !== false,
    staleTime: 1000 * 60 * 10,
  });
};

export default useCategoryDetails;

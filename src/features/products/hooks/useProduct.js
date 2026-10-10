import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "../services/productApi";

const useProduct = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
};

export default useProduct;

import { useInfiniteQuery } from "@tanstack/react-query";

import { getProducts } from "../services/productApi";

const useInfiniteProducts = (params = {}) => {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", params],

    queryFn: ({ pageParam }) => {
      const requestParams = {
        ...params,
      };

      if (pageParam) {
        requestParams.cursor = pageParam;
      } else {
        delete requestParams.cursor;
      }

      return getProducts(requestParams);
    },

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.hasNextPage) {
        return undefined;
      }

      return lastPage?.pagination?.nextCursor ?? undefined;
    },

    staleTime: 1000 * 60 * 5,
  });
};

export default useInfiniteProducts;
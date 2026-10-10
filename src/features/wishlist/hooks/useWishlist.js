import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { selectIsAuthenticated } from "../../auth/authSelectors";
import { getWishlist } from "../services/wishlistApi";

export const wishlistKeys = {
  all: ["wishlist"],
  list: (sort = "recent") => ["wishlist", "list", sort],
};

const useWishlist = ({ sort = "recent", limit = 100 } = {}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return useInfiniteQuery({
    queryKey: wishlistKeys.list(sort),
    queryFn: ({ pageParam }) =>
      getWishlist({
        cursor: pageParam,
        limit,
        sort,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.pagination?.hasNextPage
        ? lastPage.data.pagination.nextCursor
        : undefined;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
};

export default useWishlist;

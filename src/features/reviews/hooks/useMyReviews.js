import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../auth/authSelectors";
import { getMyReviews } from "../services/reviewApi";

export const myReviewsKeys = {
  all: ["reviews", "me"],
  list: (status) => ["reviews", "me", status || "all"],
};

const useMyReviews = ({ status, limit = 10 } = {}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return useInfiniteQuery({
    queryKey: myReviewsKeys.list(status),
    queryFn: ({ pageParam }) =>
      getMyReviews({
        cursor: pageParam,
        limit,
        status,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasMore
        ? lastPage.pagination.nextCursor
        : undefined,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
};

export default useMyReviews;

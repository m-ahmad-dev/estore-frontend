import { useInfiniteQuery } from "@tanstack/react-query";
import { getCustomerOrders } from "../services/orderApi";

export const customerOrdersQueryKey = (status) => [
  "orders",
  "customer",
  status ?? "all",
];

const useCustomerOrders = ({ status } = {}) => {
  return useInfiniteQuery({
    queryKey: customerOrdersQueryKey(status),
    queryFn: ({ pageParam }) =>
      getCustomerOrders({
        status: status || undefined,
        limit: 15,
        cursor: pageParam,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.data?.pagination?.has_next
        ? lastPage.data.pagination.next_cursor
        : undefined,
    staleTime: 1000 * 60,
  });
};

export default useCustomerOrders;

import { useQuery } from "@tanstack/react-query";
import { getCustomerOrder } from "../services/orderApi";

const useCustomerOrder = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getCustomerOrder(orderId),
    enabled: Boolean(orderId),
    staleTime: 1000 * 60,
  });
};

export default useCustomerOrder;

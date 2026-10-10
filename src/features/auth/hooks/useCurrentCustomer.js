import { useQuery } from "@tanstack/react-query";
import { getCurrentCustomer } from "../services/authApi";

export const CURRENT_CUSTOMER_QUERY_KEY = ["auth", "currentCustomer"];

const useCurrentCustomer = (options = {}) => {
  return useQuery({
    queryKey: CURRENT_CUSTOMER_QUERY_KEY,
    queryFn: getCurrentCustomer,
    staleTime: 1000 * 60 * 5,
    retry: false,
    ...options,
  });
};

export default useCurrentCustomer;

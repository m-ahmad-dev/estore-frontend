import { useMutation } from "@tanstack/react-query";
import { lookupOrder } from "../services/orderApi";

const useOrderLookup = () => {
  return useMutation({
    mutationFn: lookupOrder,
  });
};

export default useOrderLookup;

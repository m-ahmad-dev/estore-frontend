import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../services/orderApi";

const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export default useCreateOrder;

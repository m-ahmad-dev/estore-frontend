import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "../services/orderApi";

const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (variables?.orderId) {
        queryClient.invalidateQueries({
          queryKey: ["order", variables.orderId],
        });
      }
    },
  });
};

export default useCancelOrder;

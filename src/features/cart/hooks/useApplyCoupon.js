import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { selectAuthStatus } from "../../auth/authSelectors";
import { applyCoupon } from "../services/cartApi";
import { cartQueryKey } from "./useCart";

const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  const authStatus = useSelector(selectAuthStatus);

  return useMutation({
    mutationFn: applyCoupon,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKey(authStatus),
      });
    },
  });
};

export default useApplyCoupon;

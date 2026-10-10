import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { selectAuthStatus } from "../../auth/authSelectors";
import { removeCoupon } from "../services/cartApi";
import { cartQueryKey } from "./useCart";

const useRemoveCoupon = () => {
  const queryClient = useQueryClient();
  const authStatus = useSelector(selectAuthStatus);

  return useMutation({
    mutationFn: removeCoupon,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKey(authStatus),
      });
    },
  });
};

export default useRemoveCoupon;

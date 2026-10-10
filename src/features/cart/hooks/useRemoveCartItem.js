import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { selectAuthStatus } from "../../auth/authSelectors";
import { removeCartItem } from "../services/cartApi";
import { cartQueryKey } from "./useCart";

const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const authStatus = useSelector(selectAuthStatus);

  return useMutation({
    mutationFn: removeCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKey(authStatus),
      });
    },
  });
};

export default useRemoveCartItem;

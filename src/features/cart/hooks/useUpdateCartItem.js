import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { selectAuthStatus } from "../../auth/authSelectors";
import { updateCartItem } from "../services/cartApi";
import { cartQueryKey } from "./useCart";

const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const authStatus = useSelector(selectAuthStatus);

  return useMutation({
    mutationFn: updateCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKey(authStatus),
      });
    },
  });
};

export default useUpdateCartItem;

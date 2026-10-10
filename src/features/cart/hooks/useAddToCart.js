import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { selectAuthStatus } from "../../auth/authSelectors";
import { addCartItem } from "../services/cartApi";
import { cartQueryKey } from "./useCart";

const useAddToCart = () => {
  const queryClient = useQueryClient();
  const authStatus = useSelector(selectAuthStatus);

  return useMutation({
    mutationFn: addCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKey(authStatus),
      });
    },
  });
};

export default useAddToCart;

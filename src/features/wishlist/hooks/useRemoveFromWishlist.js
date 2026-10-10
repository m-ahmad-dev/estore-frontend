import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeFromWishlist } from "../services/wishlistApi";
import { wishlistKeys } from "./useWishlist";

const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all,
      });
    },
  });
};

export default useRemoveFromWishlist;

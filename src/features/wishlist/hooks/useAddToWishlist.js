import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addToWishlist } from "../services/wishlistApi";
import { wishlistKeys } from "./useWishlist";

const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWishlist,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.all,
      });
    },
  });
};

export default useAddToWishlist;

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAddress } from "../services/addressApi";
import { addressesQueryKey } from "./useAddresses";

const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressesQueryKey,
      });
    },
  });
};

export default useDeleteAddress;

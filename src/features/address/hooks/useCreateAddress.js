import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAddress } from "../services/addressApi";
import { addressesQueryKey } from "./useAddresses";

const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: addressesQueryKey,
      });
    },
  });
};

export default useCreateAddress;

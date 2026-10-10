import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAddress } from "../services/addressApi";
import { addressesQueryKey } from "./useAddresses";

const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAddress,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: addressesQueryKey,
      });

      if (variables?.addressId) {
        queryClient.invalidateQueries({
          queryKey: ["address", variables.addressId],
        });
      }
    },
  });
};

export default useUpdateAddress;

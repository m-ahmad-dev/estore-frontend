import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../services/addressApi";

export const addressesQueryKey = ["addresses"];

const useAddresses = () => {
  return useQuery({
    queryKey: addressesQueryKey,
    queryFn: getAddresses,
    staleTime: 1000 * 60 * 5,
  });
};

export default useAddresses;

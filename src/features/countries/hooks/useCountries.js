import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../services/countryApi";

export const countriesQueryKey = ["countries"];

const useCountries = () => {
  return useQuery({
    queryKey: countriesQueryKey,
    queryFn: getCountries,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export default useCountries;

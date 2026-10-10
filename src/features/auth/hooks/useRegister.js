import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { registerCustomer } from "../services/authApi";
import { setAccessToken } from "../services/tokenManager";
import { setCredentials } from "../authSlice";

import { CURRENT_CUSTOMER_QUERY_KEY } from "./useCurrentCustomer";

const useRegister = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerCustomer,

    onSuccess: (data) => {
      const { customer, accessToken } = data;
      setAccessToken(accessToken);
      
      dispatch(
        setCredentials({
          customer,
        }),
      );

      queryClient.setQueryData(CURRENT_CUSTOMER_QUERY_KEY, data);
    },
  });
};

export default useRegister;

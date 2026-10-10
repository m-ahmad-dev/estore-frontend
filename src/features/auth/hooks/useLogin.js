import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { loginCustomer } from "../services/authApi";
import { setAccessToken } from "../services/tokenManager";
import { setCredentials } from "../authSlice";

import { CURRENT_CUSTOMER_QUERY_KEY } from "./useCurrentCustomer";

const useLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginCustomer,

    onSuccess: (data) => {
      const { customer, accessToken } = data;

      // Keep access token in memory for Axios.
      setAccessToken(accessToken);

      // Redux stores authentication state.
      dispatch(
        setCredentials({
          customer,
        }),
      );

      // React Query owns the server-side customer data.
      queryClient.setQueryData(CURRENT_CUSTOMER_QUERY_KEY, data);
    },
  });
};

export default useLogin;

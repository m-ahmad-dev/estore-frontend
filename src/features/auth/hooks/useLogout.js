import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { logoutCustomer } from "../services/authApi";
import { clearCredentials } from "../authSlice";
import { clearAccessToken } from "../services/tokenManager";

const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutCustomer,

    onSettled: () => {
      clearAccessToken();

      dispatch(clearCredentials());

      queryClient.clear();
    },
  });
};

export default useLogout;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { deleteMyAccount } from "../services/profileApi";
import { clearAccessToken } from "../../auth/services/tokenManager";
import { clearCredentials } from "../../auth/authSlice";

const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      clearAccessToken();
      dispatch(clearCredentials());
      queryClient.clear();
    },
  });
};

export default useDeleteAccount;

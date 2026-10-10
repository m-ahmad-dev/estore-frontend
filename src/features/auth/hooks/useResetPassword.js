import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../services/authApi";

const useResetPassword = () => {
  return useMutation({
    mutationFn: (data) => resetPassword(data),
  });
};

export default useResetPassword;

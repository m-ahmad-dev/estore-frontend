import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../services/authApi";

const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => forgotPassword(email),
  });
};

export default useForgotPassword;
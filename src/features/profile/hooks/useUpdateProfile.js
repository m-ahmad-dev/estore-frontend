import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { updateMyProfile } from "../services/profileApi";
import { CURRENT_CUSTOMER_QUERY_KEY } from "../../auth/hooks/useCurrentCustomer";
import { setCredentials } from "../../auth/authSlice";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      const customer = data?.customer;
      if (customer) {
        dispatch(setCredentials({ customer }));
      }
      queryClient.invalidateQueries({ queryKey: CURRENT_CUSTOMER_QUERY_KEY });
    },
  });
};

export default useUpdateProfile;

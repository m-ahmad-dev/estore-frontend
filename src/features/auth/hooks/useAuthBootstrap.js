import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { clearCredentials, setAuthLoading, setCredentials } from "../authSlice";

import useCurrentCustomer from "./useCurrentCustomer";

const useAuthBootstrap = () => {
  const dispatch = useDispatch();

  const query = useCurrentCustomer();

  useEffect(() => {
    if (query.isLoading) {
      dispatch(setAuthLoading());
      return;
    }

    if (query.isSuccess) {
      dispatch(
        setCredentials({
          customer: query.data.customer,
        }),
      );

      return;
    }

    if (query.isError) {
      dispatch(clearCredentials());
    }
  }, [query.isLoading, query.isSuccess, query.isError, query.data, dispatch]);

  return query;
};

export default useAuthBootstrap;

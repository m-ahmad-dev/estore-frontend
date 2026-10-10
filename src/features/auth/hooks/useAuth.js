import { useDispatch, useSelector } from "react-redux";

import {
  selectAuth,
  selectAuthError,
  selectAuthStatus,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../authSelectors";

export const useAuth = () => {
  const dispatch = useDispatch();

  const auth = useSelector(selectAuth);
  const user = useSelector(selectCurrentUser);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return {
    dispatch,
    auth,
    user,
    status,
    error,
    isAuthenticated,
    isLoading: status === "loading",
  };
};

export default useAuth;

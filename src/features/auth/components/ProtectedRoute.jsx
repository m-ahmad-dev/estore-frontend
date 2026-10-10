import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAuthStatus } from "../authSelectors";

const ProtectedRoute = () => {
  const status = useSelector(selectAuthStatus);

  const location = useLocation();

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;

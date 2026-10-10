import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAuthStatus } from "../authSelectors";

const PublicOnlyRoute = () => {
  const status = useSelector(selectAuthStatus);

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;

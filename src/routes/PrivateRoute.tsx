import { Navigate, Outlet, useLocation } from "react-router-dom";

import { isCurrentUserAuthenticated } from "../services/parse/auth.service";

const PrivateRoute = () => {
  const location = useLocation();
  let isAuthenticated = false;

  try {
    isAuthenticated = isCurrentUserAuthenticated();
  } catch {
    isAuthenticated = false;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default PrivateRoute;

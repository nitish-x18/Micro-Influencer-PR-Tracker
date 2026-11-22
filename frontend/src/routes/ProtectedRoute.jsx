
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token =
    localStorage.getItem("influenceflow_token") ||
    sessionStorage.getItem("influenceflow_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

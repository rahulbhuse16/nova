import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/today" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
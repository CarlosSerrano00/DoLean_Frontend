import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../../entities/user";

export default function RequireAuth() {
  const { user } = useSession();
  const location = useLocation();

  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

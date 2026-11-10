import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
export default function ProtectedRoute({
  role,
}: {
  role?: "HRD" | "EMPLOYEE";
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}

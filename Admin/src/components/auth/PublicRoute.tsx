import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

// Agar token bor bo'lsa, signin/signup sahifalariga kirishni to'sadi
export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  // Agar token mavjud bo'lsa, dashboard ga yo'naltirish
  if (isAuthenticated) {
    if (isAdmin) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/user-dashboard" replace />;
    }
  }

  return <>{children}</>;
}

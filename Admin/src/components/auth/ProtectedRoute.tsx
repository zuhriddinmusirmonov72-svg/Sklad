import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  // Agar login qilmagan bo'lsa -> SignIn ga yo'naltirish
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Agar admin sahifasi kerak bo'lsa, lekin oddiy foydalanuvchi bo'lsa
  if (adminOnly && !isAdmin) {
    return <Navigate to="/shop" replace />;
  }

  return <>{children}</>;
}

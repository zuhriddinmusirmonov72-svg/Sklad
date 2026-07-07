import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // LocalStorage dan authentication holatini tekshirish
    const authStatus = localStorage.getItem("isAuthenticated");
    const adminStatus = localStorage.getItem("isAdmin");
    
    if (authStatus === "true") {
      setIsAuthenticated(true);
      setIsAdmin(adminStatus === "true");
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Admin login tekshirish
    if (email === "admin@gmail.com" && password === "admin") {
      setIsAuthenticated(true);
      setIsAdmin(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", "true");
      return true;
    }
    
    // Oddiy foydalanuvchi (har qanday boshqa login)
    if (email && password) {
      setIsAuthenticated(true);
      setIsAdmin(false);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", "false");
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

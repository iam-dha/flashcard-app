import { createContext, useContext, useEffect, useState } from "react";
import { UserTypes } from "@/types/user.types";
import { authService } from "@/services/authService";
import CustomLoader from "@/components/custom-ui/CustomLoader";

interface AuthContextType {
  user: UserTypes | null;
  authLoading: boolean;
  error: string | null;
  register: (email: string, password: string, username: string, otp: string, address: string, phone: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserTypes | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          if (user) {
            setUser(user);
            setIsAuthenticated(true);
          }
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = async (email: string, password: string, username: string, otp: string, address: string, phone: string) => {
    setAuthLoading(true);
    setError(null);

    try {
      const response = await authService.register({ email, password, username, otp, address, phone });
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, error, register, login, logout, isAuthenticated }}>
      {authLoading ? <CustomLoader /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

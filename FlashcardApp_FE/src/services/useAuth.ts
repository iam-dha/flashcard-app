import api from "@/services/api";
import { UserTypes, RegisterRequestTypes, LoginRequestTypes, AuthResponseTypes } from "@/types/user.types";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";

interface AuthState {
  user: UserTypes | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    authLoading: true,
    error: null,
  });

  const getUser = useCallback(async (): Promise<UserTypes | null> => {

    try {
      const response = await api.get("/user/settings");
      setAuthState((prevState) => ({ ...prevState, user: response.data.data }));
      return response.data.data;
    } catch (error) {
      logout();
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const user = await getUser();
          if (user) {
            setUser(user);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, [getUser]);

  const setUser = (user: UserTypes | null) => {
    setAuthState((prevState) => ({ ...prevState, user }));
  };

  const setAuthLoading = (authLoading: boolean) => {
    setAuthState((prevState) => ({ ...prevState, authLoading }));
  };

  const setAuthError = (error: string | null) => {
    setAuthState((prevState) => ({ ...prevState, error }));
  };

  const setIsAuthenticated = (isAuthenticated: boolean) => {
    setAuthState((prevState) => ({ ...prevState, isAuthenticated }));
  };

  const getAccessToken = (): string | null => {
    return localStorage.getItem("accessToken");
  };

  const setAccessToken = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
  };

  const handleAuth = (authData: AuthResponseTypes) => {
    setAccessToken(authData.accessToken);
    setAuthState((prevState) => ({
      ...prevState,
      isAuthenticated: true,
      authLoading: false,
      error: null,
    }));
  };

  const isAuthenticated = (): boolean => {
    return !!getAccessToken();
  };

  const register = async (authData: RegisterRequestTypes): Promise<AuthResponseTypes> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const response = await api.post("/auth/register/verify", authData);
      handleAuth(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to register";
      console.log("From API:", errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (authData: LoginRequestTypes): Promise<AuthResponseTypes> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const response = await api.post("/auth/login", authData);
      handleAuth(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to login";
      console.log("From API:", errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      Cookies.remove("refreshToken");
      setAuthState({
        user: null,
        isAuthenticated: false,
        authLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const requestOtp = async (email: string): Promise<void> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await api.post("/auth/register/request-otp", { email });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to request OTP";
      console.log("From API:", errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<{ token: string }> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const response = await api.post("/auth/register/verOtp", { email, otp });
      return { token: response.data.token };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to verify OTP";
      console.log("From API:", errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await api.post("/auth/forgot-password", { email });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to send password reset email";
      console.log("From API:", errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string, reNewPassword: string): Promise<void> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await api.post(`/auth/reset-password/${token}`, { newPassword, reNewPassword });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to reset password";
      console.log("From API:", errorMessage);
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    ...authState,
    setAccessToken,
    handleAuth,
    isAuthenticated,
    getUser,
    register,
    login,
    logout,
    requestOtp,
    verifyOtp,
    forgotPassword,
    resetPassword,
  };
};

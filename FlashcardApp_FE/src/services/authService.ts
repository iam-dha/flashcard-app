import api from "@/services/api";
import { UserTypes, RegisterRequestTypes, LoginRequestTypes, AuthResponseTypes } from "@/types/user.types";
import Cookies from "js-cookie";

class AuthService {
  private accessToken: string = "accessToken";

  async register(userData: RegisterRequestTypes): Promise<AuthResponseTypes> {
    try {
      const response = await api.post("/auth/register/verify", userData);
      this.handleAuthentication(response.data);
      return response.data;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.response?.data?.message || "Failed to register");
    }
  }

  async login(userData: LoginRequestTypes): Promise<AuthResponseTypes> {
    try {
      const response = await api.post("/auth/login", userData);
      this.handleAuthentication(response.data);
      return response.data;
    } catch (error: any) {
      throw new Error("From API: Failed to login");
    }
  }

  async requestOtp(email: string): Promise<void> {
    try {
      await api.post("/auth/register/request-otp", { email });
    } catch (error: any) {
      console.error("Request OTP error:", error);
      throw new Error(error.response?.data?.message || "Failed to request OTP");
    }
  }

  async verifyOtp(email: string, otp: string): Promise<{token: string}> {
    try {
      const response = await api.post("/auth/register/verOtp", { email, otp });
      return { token: response.data.token };
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      throw new Error(error.response?.data?.message || "Failed to verify OTP");
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post("/auth/forgot-password", { email });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      throw new Error(error.response?.data?.message || "Failed to send password reset email");
    }
  }

  async resetPassword(token: string, newPassword: string, reNewPassword: string) {
    return api.post(`/auth/reset-password/${token}`, { newPassword, reNewPassword });
  }

  private handleAuthentication(authData: AuthResponseTypes): void {
    this.setAccessToken(authData.accessToken);
  }

  async getCurrentUser(): Promise<UserTypes | null> {
    const accessToken = this.getAccessToken();
    if (!accessToken) return null;
    
    try {
      const response = await api.get("/user/settings");
      return response.data;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  async logout(): Promise<void> {
    // await api.post("/auth/logout");
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem("role");
    Cookies.remove("refreshToken");
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessToken);
  }

  setAccessToken(accessToken: string): void {
    localStorage.setItem(this.accessToken, accessToken);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
import api from "@/services/api";
import { UserTypes, RegisterRequestTypes, LoginRequestTypes, AuthResponseTypes } from "@/types/user.types";

class AuthService {
  private accessToken: string = "accessToken";

  async register(userData: RegisterRequestTypes): Promise<AuthResponseTypes> {
    try {
      const response = await api.post("/auth/register", userData);
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

  logout(): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem("role");
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
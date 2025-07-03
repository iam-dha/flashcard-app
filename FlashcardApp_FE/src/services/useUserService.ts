import { useCallback } from "react";
import api from "@/services/api";
import { ChangePasswordTypes, UserSettingsTypes } from "@/types/user.types";

export function useUserService() {
  const userSettingChange = useCallback(async (settings: UserSettingsTypes | FormData): Promise<void> => {
    try {
      // Check if settings is FormData (for file uploads) or regular object
      const isFormData = settings instanceof FormData;

      const config = isFormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {};

      const response = await api.patch("/user/settings", settings, config);
      return response.data.data;
    } catch (error) {
      console.error("User setting change error:", error);
      throw error;
    }
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordTypes): Promise<void> => {
    try {
      const response = await api.post("/auth/change-password", data);
      return response.data.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }, []);

  return {
    userSettingChange,
    changePassword,
  };
}

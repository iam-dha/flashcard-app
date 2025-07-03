import z from "zod";

export interface UserTypes {
  email: string;
  password: string;
  token: string;
  fullName: string;
  address: string;
  phone: string;
  totalScore: number;
  folderCount: number;
  accountAge: number;
  thumbnail?: string;
}

export interface RegisterRequestTypes {
  email: string;
  password: string;
  token: string;
  fullName: string;
  address: string;
  phone: string;
}

export interface LoginRequestTypes {
  email: string;
  password: string;
}

export interface AuthResponseTypes {
  status: string;
  accessToken: string;
}

export type UserSettingsTypes = Pick<UserTypes, "fullName" | "address" | "phone" | "thumbnail">;

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    reNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.reNewPassword, {
    message: "Passwords do not match",
    path: ["reNewPassword"],
  });

export type ChangePasswordTypes = z.infer<typeof changePasswordSchema>;

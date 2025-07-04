// frontend/src/components/EditProfile.tsx
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { User, Mail, Phone, MapPin, SquarePen, Pencil, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";
import { useAdminAuth } from "./AdminAuthProvider";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import { ChangePasswordTypes, changePasswordSchema } from "@/types/user.types";

// Types
interface AdminUser {
  fullName: string;
  email: string;
  address?: string;
  phone?: string;
  thumbnail?: string;
  status?: string;
  totalScore?: number;
  accountAge?: number;
  folderCount?: number;
  role?: string;
}

// Validation schemas
const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(30, "Full name must be less than 30 characters"),
  address: z.string().max(100, "Address must be less than 100 characters").optional(),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Phone number must be 10 digits starting with 0")
    .optional(),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;
// Edit Profile Dialog Component
export function EditAdminProfileDialog({
  user,
  isEditDialogOpen,
  setIsEditDialogOpen,
  handleProfileUpdate,
  updatingProfile,
}: {
  user: AdminUser;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  handleProfileUpdate: (data: ProfileUpdateForm) => void;
  updatingProfile: boolean;
}) {
  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      address: user?.address || "",
      phone: user?.phone || "",
    },
  });

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger asChild>
        <ExpandableButton Icon={SquarePen} label="Edit profile information" className="bg-muted/50 text-foreground hover:bg-muted/80 !rounded-lg" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information here. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-4">
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input placeholder="Enter your full name..." {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input placeholder="Enter your phone number..." {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input placeholder="Enter your address..." {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={updatingProfile}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatingProfile}>
                {updatingProfile ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Change Password Dialog Component
export function ChangePasswordDialog({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { api } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<ChangePasswordTypes>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      reNewPassword: "",
    },
  });

  const handleChangePassword = async (data: ChangePasswordTypes) => {
    try {
      setIsChangingPassword(true);

      await api.post("/api/v1/auth/change-password", {
        password: data.password,
        newPassword: data.newPassword,
        reNewPassword: data.reNewPassword,
      });

      toast.success("Password changed successfully!");
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Failed to change password:", error);

      if (error.response?.status === 401) {
        form.setError("password", {
          type: "manual",
          message: "Current password is incorrect",
        });
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setShowPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your password to keep your account secure.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
            {/* Current Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input type={showPassword ? "text" : "password"} placeholder="Enter your current password..." {...field} className="pl-10" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye className="text-muted-foreground h-4 w-4" /> : <EyeOff className="text-muted-foreground h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input type={showNewPassword ? "text" : "password"} placeholder="Enter your new password..." {...field} className="pl-10" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform p-0 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <Eye className="text-muted-foreground h-4 w-4" /> : <EyeOff className="text-muted-foreground h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm New Password Field */}
            <FormField
              control={form.control}
              name="reNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password..."
                        {...field}
                        className="pl-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform p-0 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <Eye className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <EyeOff className="text-muted-foreground h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isChangingPassword}>
                Cancel
              </Button>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Changing...
                  </div>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Main Admin Profile Page Component
export default function AdminProfilePage() {
  const { api } = useAdminAuth();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      address: user?.address || "",
      phone: user?.phone || "",
    },
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get("api/v1/user/settings");
        const userData = response.data.data;
        setUser(userData);

        if (userData) {
          form.reset({
            fullName: userData.fullName || "",
            address: userData.address || "",
            phone: userData.phone || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [api, form]);

  // Handle avatar upload
  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append("thumbnail", file);
      if (user?.fullName) formData.append("fullName", user.fullName);
      if (user?.address) formData.append("address", user.address);
      if (user?.phone) formData.append("phone", user.phone);

      await api.patch("/api/v1/admin/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh user data
      const response = await api.get("/api/v1/admin/user/profile");
      setUser(response.data.data);

      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (data: ProfileUpdateForm) => {
    try {
      setUpdatingProfile(true);

      const settings = {
        fullName: data.fullName,
        address: data.address || "",
        phone: data.phone || "",
        thumbnail: user?.thumbnail,
      };

      await api.patch("/api/v1/admin/user/profile", settings);

      // Refresh user data
      const response = await api.get("/api/v1/admin/user/profile");
      setUser(response.data.data);

      if (response.data.data) {
        form.reset({
          fullName: response.data.data.fullName || "",
          address: response.data.data.address || "",
          phone: response.data.data.phone || "",
        });
      }

      setIsEditDialogOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (loading) {
    return <CustomLoader />;
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <User className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="mb-2 text-2xl font-semibold">No User Data</h2>
          <p className="text-muted-foreground mb-4">Unable to load user profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <p className="text-4xl font-semibold">Admin Profile</p>

          {/* Profile Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Profile Header Card */}
            <Card className="rounded-2xl border shadow-lg">
              <CardContent className="h-full p-8">
                <div className="flex h-full flex-col">
                  {/* Avatar and Name Section */}
                  <div className="mb-8 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar className="h-32 w-32 cursor-pointer border-4 shadow-lg" onClick={handleAvatarUpload}>
                        <div className="bg-background/50 absolute inset-0 grid place-items-center rounded-full opacity-0 transition-opacity hover:opacity-100">
                          <Pencil className="h-8 w-8" />
                        </div>
                        {uploadingAvatar && (
                          <div className="bg-background/50 absolute inset-0 grid place-items-center rounded-full opacity-100">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          </div>
                        )}
                        <AvatarImage src={user.thumbnail} />
                        <AvatarFallback className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          <User className="h-16 w-16" />
                        </AvatarFallback>
                      </Avatar>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>

                    <p className="mb-2 text-3xl font-bold">{user.fullName || "Admin User"}</p>
                    <p className="text-muted-foreground text-xl">{user.email || "No email"}</p>
                  </div>

                  {/* Quick Stats Section */}
                  <div className="grid h-full grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/50">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{user.role || "No role"}</div>
                      <div className="text-center text-lg font-medium text-blue-700 dark:text-blue-300">Role</div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/50">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">{user.accountAge || 0}</div>
                      <div className="text-center text-lg font-medium text-green-700 dark:text-green-300">Account Age (years)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="space-y-4 rounded-2xl border py-6 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h2 className="flex items-center gap-2 text-2xl font-semibold">Personal Information</h2>
                <EditAdminProfileDialog
                  user={user}
                  isEditDialogOpen={isEditDialogOpen}
                  setIsEditDialogOpen={setIsEditDialogOpen}
                  handleProfileUpdate={handleProfileUpdate}
                  updatingProfile={updatingProfile}
                />
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="border-border/50 bg-muted/50 flex items-center gap-4 space-y-2 rounded-xl border p-4">
                  <User className="text-muted-foreground h-6 w-6" />
                  <div>
                    <p className="text-muted-foreground text-sm">Full Name</p>
                    <p className="font-medium">{user.fullName || "Not provided"}</p>
                  </div>
                </div>

                <div className="border-border/50 bg-muted/50 flex items-center gap-4 space-y-2 rounded-xl border p-4">
                  <Mail className="text-muted-foreground h-6 w-6" />
                  <div>
                    <p className="text-muted-foreground text-sm">Email Address</p>
                    <p className="font-medium">{user.email || "Not provided"}</p>
                  </div>
                </div>

                <div className="border-border/50 bg-muted/50 flex items-center gap-4 space-y-2 rounded-xl border p-4">
                  <Phone className="text-muted-foreground h-6 w-6" />
                  <div>
                    <p className="text-muted-foreground text-sm">Phone Number</p>
                    <p className="font-medium">{user.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="border-border/50 bg-muted/50 flex items-center gap-4 space-y-2 rounded-xl border p-4">
                  <MapPin className="text-muted-foreground h-6 w-6" />
                  <div>
                    <p className="text-muted-foreground text-sm">Address</p>
                    <p className="font-medium">{user.address || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-3xl font-semibold">Settings</p>

            {/* Change Password Settings */}
            <div className="border-border/50 bg-muted/30 flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-4">
                <div className="border-border flex h-10 w-10 items-center justify-center rounded-lg border">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-muted-foreground text-sm">Update your password to keep your account secure</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setIsChangePasswordDialogOpen(true)} className="hover:bg-card/80 bg-transparent">
                <SquarePen className="h-6 w-6" />
                Change
              </Button>
            </div>
          </div>

          {/* Change Password Dialog */}
          <ChangePasswordDialog isOpen={isChangePasswordDialogOpen} setIsOpen={setIsChangePasswordDialogOpen} />
        </div>
      </div>
    </div>
  );
}

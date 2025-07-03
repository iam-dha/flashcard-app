import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/services/useAuth";
import { useUserService } from "@/services/useUserService";
import { ChangePasswordTypes, changePasswordSchema, UserTypes } from "@/types/user.types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, ArrowLeft, SquarePen, Pencil, Lock, Shield, Eye, EyeOff, Sun } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import CustomBackButton from "@/components/custom-ui/CustomBackButton";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExpandableButton } from "@/components/custom-ui/ExpandableButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

// Validation schema for profile update
const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(30, "Full name must be less than 30 characters"),
  address: z.string().max(100, "Address must be less than 100 characters").optional(),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Phone number must be 10 digits starting with 0")
    .optional(),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export function EditUserProfileDialog({
  user,
  isEditDialogOpen,
  setIsEditDialogOpen,
  handleProfileUpdate,
  updatingProfile,
}: {
  user: UserTypes;
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
        <ExpandableButton Icon={SquarePen} label="Edit profile's information" className="bg-muted/50 text-foreground hover:bg-muted/80 !rounded-lg" />
      </DialogTrigger>
      <DialogContent className="bg-background dark:bg-background border-border dark:border-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground dark:text-foreground">Edit Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground dark:text-muted-foreground">
            Update your personal information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-4">
            {/* Full Name Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground dark:text-foreground">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="text-muted-foreground dark:text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input
                        placeholder="Enter your full name..."
                        {...field}
                        className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground pl-10"
                      />
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
                  <FormLabel className="text-foreground dark:text-foreground">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="text-muted-foreground dark:text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input
                        placeholder="Enter your phone number..."
                        {...field}
                        className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground pl-10"
                      />
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
                  <FormLabel className="text-foreground dark:text-foreground">Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="text-muted-foreground dark:text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input
                        placeholder="Enter your address..."
                        {...field}
                        className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={updatingProfile}
                className="hover:bg-accent/80 dark:hover:bg-accent/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updatingProfile}
                className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground"
              >
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

export function ChangePasswordDialog({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { changePassword } = useUserService();
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

      await changePassword(data);

      toast.success("Password changed successfully!");
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Failed to change password:", error);

      // handle specific error messages from the API
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

  // reset form when dialog closes
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
      <DialogContent className="bg-background dark:bg-background border-border dark:border-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground dark:text-foreground">Change Password</DialogTitle>
          <DialogDescription className="text-muted-foreground dark:text-muted-foreground">
            Update your password to keep your account secure.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
            {/* Current Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground dark:text-foreground">Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground dark:text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your current password..."
                        {...field}
                        className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground pl-10"
                      />
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
                  <FormLabel className="text-foreground dark:text-foreground">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground dark:text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter your new password..."
                        {...field}
                        className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground pl-10"
                      />
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
                  <FormLabel className="text-foreground dark:text-foreground">Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="text-muted-foreground dark:text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password..."
                        {...field}
                        className="bg-background dark:bg-background border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground pl-10"
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isChangingPassword}
                className="hover:bg-accent/80 dark:hover:bg-accent/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground"
              >
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

export function Settings() {
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);

  return (
    <>
      <p className="text-foreground flex items-center gap-2 text-3xl font-semibold">Settings</p>
      {/* Theme Settings */}
      <div className="border-border/50 dark:border-border/50 bg-muted/30 dark:bg-muted/30 flex items-center justify-between rounded-xl border p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border">
            <Sun className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-foreground font-medium">Theme</p>
            <p className="text-muted-foreground dark:text-muted-foreground text-sm">Change the theme of the app</p>
          </div>
        </div>
        <ThemeToggle variant="compact" />
      </div>
      {/* Change Password Settings */}
      <div className="border-border/50 dark:border-border/50 bg-muted/30 dark:bg-muted/30 flex items-center justify-between rounded-xl border p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border">
            <Lock className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-foreground font-medium">Change Password</p>
            <p className="text-muted-foreground dark:text-muted-foreground text-sm">Update your password to keep your account secure</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsChangePasswordDialogOpen(true)} className="hover:bg-card/80 bg-transparent">
          <SquarePen className="h-6 w-6 text-foreground" />
          Change
        </Button>
      </div>
      {/* Change Password Dialog */}
      <ChangePasswordDialog isOpen={isChangePasswordDialogOpen} setIsOpen={setIsChangePasswordDialogOpen} />
    </>
  );
}

export default function UserProfilePage() {
  const { getUser } = useAuth();
  const { userSettingChange } = useUserService();
  const [user, setUser] = useState<UserTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getUser();
        setUser(currentUser);

        // Update form with current user data when user is loaded
        if (currentUser) {
          form.reset({
            fullName: currentUser.fullName || "",
            address: currentUser.address || "",
            phone: currentUser.phone || "",
          });
        }

        console.log("Current user:", currentUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [getUser, form]);

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploadingAvatar(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("thumbnail", file);

      // add other current user settings to maintain them
      if (user?.fullName) formData.append("fullName", user.fullName);
      if (user?.address) formData.append("address", user.address);
      if (user?.phone) formData.append("phone", user.phone);

      await userSettingChange(formData);

      // Refresh user data to get updated avatar
      const updatedUser = await getUser();
      setUser(updatedUser);

      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleProfileUpdate = async (data: ProfileUpdateForm) => {
    try {
      setUpdatingProfile(true);

      // Create the settings object with the current thumbnail to preserve it
      const settings = {
        fullName: data.fullName,
        address: data.address || "",
        phone: data.phone || "",
        thumbnail: user?.thumbnail, // Preserve current thumbnail
      };

      await userSettingChange(settings);

      // Refresh user data
      const updatedUser = await getUser();
      setUser(updatedUser);

      // Update form with new data
      if (updatedUser) {
        form.reset({
          fullName: updatedUser.fullName || "",
          address: updatedUser.address || "",
          phone: updatedUser.phone || "",
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
      <div className="bg-background dark:bg-background flex h-screen items-center justify-center">
        <div className="text-center">
          <User className="text-muted-foreground dark:text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="text-foreground dark:text-foreground mb-2 text-2xl font-semibold">No User Data</h2>
          <p className="text-muted-foreground dark:text-muted-foreground mb-4">Unable to load user profile</p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-background min-h-screen">
      {/* Header */}
      <div className="border-border dark:border-border bg-background/80 dark:bg-background/80 sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="py-2">
          <div className="ml-2 flex items-center justify-between">
            <CustomBackButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <p className="text-foreground dark:text-foreground text-4xl font-semibold">Profile</p>
          {/* Detailed Information Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Profile Header Card */}
            <Card className="bg-card/50 border-border dark:border-border rounded-2xl border shadow-lg backdrop-blur-sm">
              <CardContent className="h-full p-8">
                <div className="flex h-full flex-col">
                  {/* Avatar and Name Section */}
                  <div className="mb-8 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar
                        className="border-background dark:border-background h-32 w-32 cursor-pointer border-4 shadow-lg"
                        onClick={handleAvatarUpload}
                      >
                        <div className="bg-background/50 dark:bg-background/50 absolute inset-0 grid place-items-center rounded-full opacity-0 transition-opacity hover:opacity-100">
                          <Pencil className="text-foreground dark:text-foreground h-8 w-8" />
                        </div>
                        {uploadingAvatar && (
                          <div className="bg-background/50 dark:bg-background/50 absolute inset-0 grid place-items-center rounded-full opacity-100">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          </div>
                        )}
                        <AvatarImage src={user.thumbnail} />
                        <AvatarFallback className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white dark:from-blue-600 dark:to-purple-700">
                          <User className="h-16 w-16" />
                        </AvatarFallback>
                      </Avatar>
                      {/* Hidden file input */}
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>

                    <p className="text-foreground dark:text-foreground mb-2 text-3xl font-bold">{user.fullName || "User Name"}</p>
                    <p className="text-muted-foreground dark:text-muted-foreground text-xl">{user.email || "No email"}</p>
                  </div>
                  {/* Quick Stats Section */}
                  <div className="grid h-full grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/50">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{user.folderCount}</div>
                      <div className="text-center text-lg font-medium text-blue-700 dark:text-blue-300">Folders</div>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/50">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">{user.totalScore}</div>
                      <div className="text-center text-lg font-medium text-green-700 dark:text-green-300">
                        Total score in
                        <br /> Word Scramble
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="bg-card/50 border-border dark:border-border space-y-4 rounded-2xl border py-6 shadow-lg backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h2 className="text-foreground dark:text-foreground flex items-center gap-2 text-2xl font-semibold">Personal Information</h2>
                <EditUserProfileDialog
                  user={user}
                  isEditDialogOpen={isEditDialogOpen}
                  setIsEditDialogOpen={setIsEditDialogOpen}
                  handleProfileUpdate={handleProfileUpdate}
                  updatingProfile={updatingProfile}
                />
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-muted/50 dark:bg-muted/50 border-border/50 dark:border-border/50 flex items-center gap-4 space-y-2 rounded-xl border p-4">
                  <User className="text-muted-foreground dark:text-muted-foreground h-6 w-6" />
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">Username</p>
                    <p className="text-foreground dark:text-foreground font-medium">{user.fullName || "Not provided"}</p>
                  </div>
                </div>

                <div className="bg-muted/50 dark:bg-muted/50 border-border/50 dark:border-border/50 flex items-center gap-4 space-y-2 rounded-xl border p-4">
                  <Mail className="text-muted-foreground dark:text-muted-foreground h-6 w-6" />
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">Email Address</p>
                    <p className="text-foreground dark:text-foreground font-medium">{user.email || "Not provided"}</p>
                  </div>
                </div>

                <div className="bg-muted/50 dark:bg-muted/50 border-border/50 dark:border-border/50 flex items-center gap-4 space-y-2 rounded-xl border p-4">
                  <Phone className="text-muted-foreground dark:text-muted-foreground h-6 w-6" />
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">Phone Number</p>
                    <p className="text-foreground dark:text-foreground font-medium">{user.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="bg-muted/50 dark:bg-muted/50 border-border/50 dark:border-border/50 flex items-center gap-4 space-y-2 rounded-xl border p-4">
                  <MapPin className="text-muted-foreground dark:text-muted-foreground h-6 w-6" />
                  <div>
                    <p className="text-muted-foreground dark:text-muted-foreground text-sm">Address</p>
                    <p className="text-foreground dark:text-foreground font-medium">{user.address || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Section */}
          <Settings />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { authService } from "@/services/authService";
import { UserTypes } from "@/types/user.types";
import { Button } from "@/components/ui/button";

export default function UserProfilePage() {
  const [user, setUser] = useState<UserTypes | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        console.log("Current user:", currentUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Button onClick={() => (window.location.href = "/")}>Back to home</Button>
      <div className="flex w-full justify-between p-4">
        <p className="">Appearance</p>
        <ThemeToggle variant="compact" />
      </div>
      <p>{user?.fullName ? user.fullName : "Guest"}</p>
      <p>{user?.email ? user.email : "No email"}</p>
      <p>{user?.address ? user.address : "No address"}</p>
      <p>{user?.phone ? user.phone : "No phone number"}</p>
    </>
  );
}

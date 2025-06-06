import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { UserTypes } from "@/types/user.types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";

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
    <div>
      <Button onClick={() => (window.location.href = "/")} className="m-4">
        Back to home
      </Button>
      <div className="mx-4 md:flex gap-4">
        <div className="flex h-fit w-full flex-1">
          <Card className="w-full p-4 shadow-lg backdrop-blur-xl">
            <CardHeader className="flex flex-col items-center mt-4">
              <Avatar className="w-48 h-48">
                <AvatarImage />
                <AvatarFallback className="flex items-center justify-center rounded-full bg-gray-200">
                  <User className="w-full h-full" />
                </AvatarFallback>
              </Avatar>
              <h1 className="mt-4 text-4xl font-bold">{user?.fullName ? user?.fullName : null}</h1>
            </CardHeader>
          </Card>
        </div>
        <div className="flex h-screen w-full flex-2 items-center bg-red-500"></div>
      </div>
    </div>
  );
}

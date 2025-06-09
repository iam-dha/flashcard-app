import { useEffect, useState } from "react";
import { useAuth } from "@/services/useAuth";
import { UserTypes } from "@/types/user.types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";

export default function UserProfilePage() {
  const { getUser } = useAuth();
  const [user, setUser] = useState<UserTypes | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUser();
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
      <div className="mx-4 gap-4 md:flex">
        <div className="flex h-fit w-full flex-1">
          <Card className="w-full p-4 shadow-lg backdrop-blur-xl">
            <CardHeader className="mt-4 flex flex-col items-center">
              <Avatar className="h-48 w-48">
                <AvatarImage />
                <AvatarFallback className="flex items-center justify-center rounded-full bg-gray-200">
                  <User className="h-full w-full" />
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

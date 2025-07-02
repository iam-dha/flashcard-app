import { useEffect, useState } from "react";
import { useAuth } from "@/services/useAuth";
import { UserTypes } from "@/types/user.types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, ArrowLeft, Edit } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import CustomBackButton from "@/components/custom-ui/CustomBackButton";

export default function UserProfilePage() {
  const { getUser } = useAuth();
  const [user, setUser] = useState<UserTypes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getUser();
        setUser(currentUser);
        console.log("Current user:", currentUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [getUser]);

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
          <Button onClick={() => (window.location.href = "/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-200">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="py-2">
          <div className="flex items-center justify-between ml-2">
            <CustomBackButton />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Detailed Information Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Profile Header Card */}
          <Card className="mb-8 border-0 bg-white/90 shadow-lg backdrop-blur-sm h-full flex items-center justify-center">
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-5xl font-bold text-white">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="mt-4">
                    Active User
                  </Badge>
                </div>

                {/* User Info Section */}
                <div>
                  <h1 className="mb-2 text-4xl font-bold text-gray-900">{user.fullName || "User Name"}</h1>
                  <p className="mb-6 text-lg text-gray-600">Welcome to your profile dashboard</p>

                  {/* Quick Stats */}
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-blue-50 p-4 flex flex-col items-center justify-center gap-1">
                      <div className="text-2xl font-bold text-blue-600">{user.folderCount}</div>
                      <div className="text-sm text-gray-600">Folders</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4 flex flex-col items-center justify-center gap-1">
                      <div className="text-2xl font-bold text-green-600">{user.totalScore}</div>
                      <div className="text-sm text-gray-600 text-center">Total Score in Word Scramble</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            {/* Personal Information */}
            <Card className="border-0 bg-white/90 shadow-lg backdrop-blur-sm py-6 space-y-4">
              <CardHeader>
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                  <User className="h-6 w-6 text-blue-600" />
                  Personal Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg bg-muted p-4 space-y-2">
                  <Mail className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium">{user.email || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-muted p-4 space-y-2">
                  <Phone className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{user.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-muted p-4 space-y-2">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{user.address || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              View Activity
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import LoginForm from "@/features/client/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/features/client/auth/AuthContext";
import FlashcardAppNameAnimation from "./FlashcardAppNameAnimation";

export default function LoginPage() {
  const { isAuthenticated, authLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated() && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  return (
    <div className="flex min-h-screen min-w-screen">
      {/* Left: Animation */}
      <div className="flex flex-1 items-center justify-center rounded-lg m-4 bg-gradient-to-br from-blue-100 to-blue-300">
        <FlashcardAppNameAnimation />
      </div>
      {/* Right: Login Form */}
      <div className="flex min-w-2/5 items-center justify-center rounded-lg bg-white p-4">
        <LoginForm />
      </div>
    </div>
  );
}

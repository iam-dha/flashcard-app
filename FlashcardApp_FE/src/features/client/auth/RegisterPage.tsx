import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/features/client/auth/AuthContext";
import RegisterForm from "./RegisterForm";
import FlashcardAppNameAnimation from "./FlashcardAppNameAnimation";

export default function RegisterPage() {
  const { isAuthenticated, authLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated() && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  return (
    <div className="flex min-h-screen min-w-screen">
      <div className="flex flex-1 items-center justify-center rounded-lg m-4 bg-gradient-to-br from-blue-100 to-blue-300">
        <FlashcardAppNameAnimation />
      </div>
      <div className="flex min-w-2/5 items-center justify-center rounded-lg bg-white p-4">
      <RegisterForm />
      </div>
    </div>
  );
}

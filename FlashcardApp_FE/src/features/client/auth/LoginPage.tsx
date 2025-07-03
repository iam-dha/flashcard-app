import LoginForm from "@/features/client/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/features/client/auth/AuthContext";
import FlashcardAppNameAnimation from "./FlashcardAppNameAnimation";
import { useIsMobile } from "@/hooks/useMobile";

export default function LoginPage() {
  const { isAuthenticated, authLoading } = useAuthContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isAuthenticated() && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  return (
    <>
      {!isMobile ? (
        <div className="flex min-h-screen min-w-screen">
          <FlashcardAppNameAnimation />
          <div className="flex min-w-2/5 items-center justify-center rounded-lg bg-white p-4">
            <LoginForm />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      )}
    </>
  );
}

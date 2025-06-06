import LoginForm from "@/features/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  return (
    <div className="flex flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
}

import LoginForm from "@/features/client/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/features/client/auth/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, authLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated() && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  return (
    <div className="flex items-center justify-center">
      <LoginForm />
    </div>
  );
}

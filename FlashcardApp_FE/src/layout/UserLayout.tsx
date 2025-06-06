import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import CustomLoader from "../components/custom-ui/CustomLoader";
import { Toaster } from "sonner";

export default function UserLayout() {
  const { isAuthenticated, authLoading } = useAuth();

  return authLoading ? (
    <CustomLoader />
  ) : isAuthenticated ? (
    <>
      <Outlet />
      <Toaster richColors closeButton />
    </>
  ) : (
    <Navigate to="/auth/login" replace />
  );
}

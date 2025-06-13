import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/features/client/auth/AuthContext";
import CustomLoader from "../components/custom-ui/CustomLoader";
import { Toaster } from "sonner";

export default function UserLayout() {
  const { isAuthenticated, authLoading } = useAuthContext();

  return authLoading ? (
    <CustomLoader />
  ) : isAuthenticated() ? (
    <>
      <Outlet />
      <Toaster richColors closeButton />
    </>
  ) : (
    <Navigate to="/auth/login" replace />
  );
}

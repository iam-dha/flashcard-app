import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import CustomLoader from "../components/custom-ui/CustomLoader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./sidebar/AppSidebar";
import AppHeader from "./AppHeader";
import { Toaster } from "sonner";

export default function AppLayout() {
  const { isAuthenticated, authLoading } = useAuth();
  const defaultOpen = localStorage.getItem("sidebarOpen") === "true" || false;

  return authLoading ? (
    <CustomLoader />
  ) : isAuthenticated ? (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="relative">
          <div className="flex min-w-xs flex-1 flex-col">
            <AppHeader />
            <div className="flex min-w-xs flex-1 flex-col gap-4 p-4 md:p-6">
              <Outlet />
              <Toaster richColors closeButton />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  ) : (
    <Navigate to="/auth/login" replace />
  );
}

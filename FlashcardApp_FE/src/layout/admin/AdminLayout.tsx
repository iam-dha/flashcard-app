import { Outlet } from "react-router-dom";
import { AdminAuthProvider } from "./AdminAuthProvider";

export default function AdminLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}

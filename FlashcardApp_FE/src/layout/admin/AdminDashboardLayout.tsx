// frontend/src/components/DashboardLayout.tsx
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthProvider";
import { Button } from "@/components/ui/button";

export default function AdminDashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Danh sách các item sidebar
  const menuItems = [
    { label: "Profile", path: "/admin" },
    { label: "User Management", path: "/admin/user" },
    { label: "Post Management", path: "/admin/post" },
    { label: "Access Management", path: "/admin/access" },
  ];

  const { logout } = useAdminAuth();
  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-100 p-4">
        <h2 className="mb-4 text-xl font-bold">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          {menuItems.map(({ label, path }) => {
            const isActive = pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`rounded px-3 py-2 text-left ${isActive ? "bg-blue-100 font-semibold text-blue-600" : "text-gray-700 hover:bg-gray-200"} `}
              >
                {label}
              </button>
            );
          })}
          <Button variant="outline" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </nav>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

import { SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SidebarFooterContent() {
  const { state } = useSidebar();
  const { logout } = useAuth();

  return (
    <SidebarFooter>
      <Button variant="ghost" size="icon" onClick={logout} title="Logout">
        <LogOut className="h-4 w-4" />
      </Button>
      <div className={state === "expanded" ? "" : "flex items-center justify-center"}>
        {state === "expanded" ? <ThemeToggle variant="compact" /> : <ThemeToggle variant="icon" />}
      </div>
    </SidebarFooter>
  );
}

import { Sidebar } from "@/components/ui/sidebar";
import SidebarHeaderContent from "./SidebarHeaderContent";
import SidebarMenuList from "./SidebarMenuList";
import SidebarFooterContent from "./SidebarFooterContent";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="transition-all duration-500 ease-in-out z-20" variant="sidebar">
      <SidebarHeaderContent />
      <SidebarMenuList />
      <SidebarFooterContent />
    </Sidebar>
  );
}

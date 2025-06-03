import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

export default function CustomSidebarTrigger({ variant }: { variant: "open" | "close" }) {
  const { toggleSidebar } = useSidebar();

  function SidebarTriggerButton({ Icon }: { Icon: React.ElementType }) {
    return (
      <Button
        onClick={() => {
          if (localStorage.getItem("sidebarOpen") === "true") {
            localStorage.setItem("sidebarOpen", "false");
          } else {
            localStorage.setItem("sidebarOpen", "true");
          }
          toggleSidebar();
        }}
        title="Toggle sidebar"
        variant="ghost"
        className="hover:bg-card/50"
      >
        <Icon style={{ width: "20px", height: "20px" }} />
      </Button>
    );
  }

  if (variant === "open") {
    return SidebarTriggerButton({ Icon: PanelLeftOpen });
  } else if (variant === "close") {
    return SidebarTriggerButton({ Icon: PanelLeftClose });
  }
}

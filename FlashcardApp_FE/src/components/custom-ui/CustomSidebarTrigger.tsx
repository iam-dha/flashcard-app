import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";

export default function CustomSidebarTrigger({ variant }: { variant: "open" | "close" }) {
  const { toggleSidebar } = useSidebar();

  function SidebarTriggerButton({ Icon }: { Icon: React.ElementType }) {
    return (
      <Button onClick={toggleSidebar} title="Toggle sidebar" variant="ghost" style={{ paddingInline: 8 }}>
        <Icon style={{ width: "16px", height: "16px" }} />
      </Button>
    );
  }

  if (variant === "open") {
    return SidebarTriggerButton({ Icon: PanelLeftOpen });
  } else if (variant === "close") {
    return SidebarTriggerButton({ Icon: PanelLeftClose });
  }
}

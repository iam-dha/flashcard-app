import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LogoutConfirmDialog from "@/features/auth/LogoutConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound, Cog, LogOut } from "lucide-react";
import { useState } from "react";

export default function FolderCardDropdownMenu() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      {!showLogoutConfirm ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="text-card-foreground hover:bg-accent/50 flex items-center justify-center rounded-full bg-transparent">
            <Avatar>
              <AvatarImage></AvatarImage>
              <AvatarFallback>NH</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 flex flex-col rounded-xl">
            <Button variant="ghost" className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">
              <CircleUserRound />
              Profile
            </Button>
            <Button variant="ghost" className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">
              <Cog />
              Settings
            </Button>
            <Button variant="ghost" className="hover:bg-destructive/20 justify-start rounded-lg bg-transparent" onClick={() => setShowLogoutConfirm(true)}>
              <LogOut className="text-red-500" />
              <p className="text-red-500">Log out</p>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div
          className="frosted-glass fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-black/30"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LogoutConfirmDialog onCancel={() => setShowLogoutConfirm(false)} />
          </div>
        </div>
      )}
    </>
  );
}

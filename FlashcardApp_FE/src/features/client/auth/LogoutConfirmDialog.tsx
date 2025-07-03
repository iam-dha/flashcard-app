import { useState } from "react";
import { useAuth } from "@/services/useAuth";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AlertMessage from "@/components/custom-ui/AlertMessage";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutConfirmDialog() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      logout();
      setSuccess("Logged out successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError("Failed to log out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="hover:bg-destructive/15 text-destructive justify-start rounded-lg bg-transparent">
          <LogOut />
          Log out
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log out</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
          {success && <AlertMessage type="success" message={success} />}
          {error && <AlertMessage type="error" message={error} />}
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} className="bg-destructive/15 text-destructive/70 hover:bg-destructive/30">
            {loading ? "Logging out..." : "Log out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

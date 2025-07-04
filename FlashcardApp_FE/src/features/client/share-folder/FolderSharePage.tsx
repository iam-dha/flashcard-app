import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFolderService } from "@/services/useFolderService";
import { FolderTypes } from "@/types/folder.types";
import FolderDetailPage from "../folders/FolderDetailPage";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import AlertMessage from "@/components/custom-ui/AlertMessage";
import { Button } from "@/components/ui/button";
import { Lock, Home } from "lucide-react";

export default function FolderSharePage() {
  const { slug } = useParams<{ slug: string }>();
  const { getFolderBySlug } = useFolderService();
  const [folder, setFolder] = useState<FolderTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkFolderAccess = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setAccessDenied(false);
        setError(null);

        const folderData = await getFolderBySlug(slug);
        setFolder(folderData);
      } catch (err: any) {
        console.error("Error accessing shared folder:", err);

        // Check if it's a 403 error (access denied)
        if (err.response?.status === 403) {
          setAccessDenied(true);
          setError(err.response?.data?.message || "You don't have permission to access this folder");
        } else if (err.response?.status === 404) {
          setError("Folder not found. The link may be invalid or the folder may have been deleted.");
        } else {
          setError("Failed to load folder. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkFolderAccess();
  }, [slug, getFolderBySlug]);

  if (loading) {
    return <CustomLoader />;
  }

  if (accessDenied) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
            <Lock className="h-12 w-12 text-gray-500" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-foreground text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground max-w-md">
              This folder is private and you don't have permission to view it. Only the folder owner can access private folders.
            </p>
          </div>
        </div>

        {error && <AlertMessage type="error" message={error} />}

        <div className="flex gap-3">
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => (window.location.href = "/home")} className="bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (error && !accessDenied) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6">
        <div className="space-y-4 text-center">
          <h2 className="text-foreground text-2xl font-bold">Oops! Something went wrong</h2>
          <AlertMessage type="error" message={error} />
        </div>

        <div className="flex gap-3">
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
          <Button onClick={() => (window.location.href = "/home")} className="bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // If we have a folder and no errors, render the normal folder detail page
  return <FolderDetailPage />;
}

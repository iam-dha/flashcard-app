import { useState } from "react";
import { folderService } from "@/services/folderService";
import { Button } from "@/components/ui/button";
import { AlertCircle, CircleCheck } from "lucide-react";

interface DeleteFolderCardProps {
  slug: string;
  name: string;
  onCancel: () => void;
}

export default function DeleteFolderCard({ slug, name, onCancel }: DeleteFolderCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await folderService.deleteFolder(slug);
      setSuccess("Folder has been deleted.");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError("Failed to delete folder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card w-lg rounded-lg p-6 shadow-md">
      <p className="mb-2 text-xl font-bold">Delete Folder</p>
      <p className="">
        Are you sure you want to delete <span className="font-semibold">{name || "this folder"}</span>?<br />
        This action cannot be undone.
      </p>
      {error && (
        <div className="bg-destructive/15 text-destructive mt-6 flex items-center gap-2 rounded-md p-3 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 mt-6 flex items-center gap-2 rounded-md bg-green-200 p-3 text-sm text-green-500 dark:bg-green-700 dark:text-green-300">
          <CircleCheck className="h-4 w-4" />
          {success}
        </div>
      )}
      <div className="mt-6 flex items-center justify-end gap-4">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button className="bg-destructive/20 text-red-500 hover:bg-red-500/40" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

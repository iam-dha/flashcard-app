import { useState } from "react";
import { useFolderService } from "@/services/useFolderService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogTitle, DialogDescription, DialogContent, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { triggerFolderListRefresh } from "../hooks/useFolderListRefresh";

interface DeleteFolderCardProps {
  trigger: React.ReactNode; // Optional trigger prop for custom button
  slug: string;
  name: string;
}

export default function DeleteFolderCard({ trigger, slug, name }: DeleteFolderCardProps) {
  const { deleteFolder } = useFolderService();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // Add controlled state

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteFolder(slug);
      toast.success("Folder has been deleted.");
      setOpen(false);
      // setTimeout here is very important
      // it allows the dialog to close before refreshing the folder list
      setTimeout(() => {
        triggerFolderListRefresh();
      }, 1000);
    } catch (err) {
      toast.error("Failed to delete folder.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <span className="font-semibold">{name || "this folder"}</span>?<br />
          This action cannot be undone.
        </DialogDescription>
        <div className="mt-6 flex items-center justify-end gap-4">
          <DialogClose asChild disabled={loading}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button className="bg-destructive/20 text-red-500 hover:bg-red-500/40" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
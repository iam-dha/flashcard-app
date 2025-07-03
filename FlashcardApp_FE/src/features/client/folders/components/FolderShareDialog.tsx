import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, Copy, Check } from "lucide-react";
import { FolderTypes } from "@/types/folder.types";
import FolderUpdateInfoDialog from "./FolderUpdateInfoDialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function FolderShareDialog({
  slug,
  isPublic,
  name,
  description,
  tags,
}: Pick<FolderTypes, "slug" | "isPublic" | "name" | "description" | "tags">) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // use the same base URL as in the API service
  const baseUrl = "http://localhost:5173";
  const shareLink = `${baseUrl}/share-folder/${slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">
          <Share />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share folder</DialogTitle>
          {isPublic ? (
            <DialogDescription>Share this folder with others using the link below</DialogDescription>
          ) : (
            <DialogDescription>Your folder is currently private. Make it public to share it with others.</DialogDescription>
          )}
        </DialogHeader>
        {isPublic ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input value={shareLink} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline" size="sm" className="shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">Anyone with this link can view your folder and its flashcards.</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <FolderUpdateInfoDialog slug={slug} name={name} description={description || ""} tags={tags || []} isPublic={isPublic} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

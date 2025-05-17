import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, PencilLine, Share, Trash } from "lucide-react";
import { useState } from "react";
import DeleteFolderCard from "./FolderDeleteDialog";

interface FolderCardDropdownMenuProps {
  slug: string;
  name: string;
}

export default function FolderCardDropdownMenu({ slug, name }: FolderCardDropdownMenuProps) {
  const [showDeleteCard, setShowDeleteCard] = useState(false);

  return (
    <>
      {!showDeleteCard ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="text-card-foreground hover:bg-accent/50 -mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-transparent">
            <EllipsisVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 flex flex-col rounded-xl">
            <Button variant="ghost" className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">
              <PencilLine />
              Rename
            </Button>
            <Button variant="ghost" className="hover:bg-accent/40 text-card-foreground justify-start rounded-lg bg-transparent">
              <Share />
              Share
            </Button>
            <Button variant="ghost" className="hover:bg-destructive/20 justify-start rounded-lg bg-transparent" onClick={() => setShowDeleteCard(true)}>
              <Trash className="text-red-500" />
              <p className="text-red-500">Delete</p>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div
          className="frosted-glass fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-black/30"
          onClick={() => setShowDeleteCard(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteFolderCard slug={slug} name={name} onCancel={() => setShowDeleteCard(false)} />
            <div className="-mt-12 mr-4 flex justify-end"></div>
          </div>
        </div>
      )}
    </>
  );
}

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, PencilLine, Share } from "lucide-react";
import DeleteFolderCard from "./FolderDeleteDialog";

interface FolderCardDropdownMenuProps {
  slug: string;
  name: string;
}

export default function FolderCardDropdownMenu({ slug, name }: FolderCardDropdownMenuProps) {
  return (
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
        <DeleteFolderCard slug={slug} name={name} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

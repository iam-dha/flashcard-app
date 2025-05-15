import { Folder as FolderIcon, FolderUp } from "lucide-react";
import { FolderTypes as FolderTypes } from "@/types/folder.types";
import FolderCardDropdownMenu from "./FolderCardDropdownMenu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FolderCard({ folder }: { folder: FolderTypes }) {
  return (
    <div className="bg-accent text-card-foreground hover:bg-accent/50 w-full rounded-xl p-4 shadow-sm">
      <Link to={`/folders/${folder.slug}`}>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex w-full items-center">
            {folder.isPublic ? <FolderUp className="h-4 w-4" /> : <FolderIcon className="h-4 w-4" />}
            <Button variant="link" className="-ml-2 truncate text-lg">
              {folder.name}
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground line-clamp-2 truncate">{folder.description}</p>
      </Link>
      <div className="mt-4 flex items-end justify-between">
        <Button className="hover:bg-accent/50 text-card-foreground bg-card-foreground/10 justify-start rounded-lg">Study</Button>
        <FolderCardDropdownMenu slug={folder.slug} name={folder.name} />
      </div>
    </div>
  );
}
